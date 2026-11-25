const STATUS_CONFIG = [
  { key: 'PENDIENTE', label: 'Por hacer', color: '#5d7ba1' },
  { key: 'EN_PROGRESO', label: 'En curso', color: '#30a4ee' },
  { key: 'EN_REVISION', label: 'En revisión', color: '#ffca2c' },
  { key: 'COMPLETADA', label: 'Completadas', color: '#21bd8a' },
];

function TaskStatusChart({ tasks }) {
  const total = tasks.length;

  const counts = STATUS_CONFIG.map((status) => ({
    ...status,
    count: tasks.filter((task) => task.estado === status.key).length,
  }));

  let accumulated = 0;

  const segments = counts.map((status) => {
    const start = accumulated;
    accumulated += total ? (status.count / total) * 100 : 0;

    return `${status.color} ${start}% ${accumulated}%`;
  });

  const background = total
    ? `conic-gradient(${segments.join(', ')})`
    : '#e5edf7';

  return (
    <section className="panel">
      <h2>Estado de tareas</h2>
      <p className="sub">Distribución actual</p>

      <div className="donutwrap">
        <div className="donut" style={{ background }}>
          <div>
            <strong>{total}</strong>
            <span>Tareas</span>
          </div>
        </div>

        <ul className="legend">
          {counts.map((status) => (
            <li key={status.key}>
              <i style={{ backgroundColor: status.color }} />
              {status.label}
              <b>{status.count}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TaskStatusChart;