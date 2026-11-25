function StatCard({ title, value, icon: Icon, color, description }) {
  return (
    <article className="stat dashboard-stat">
      <span className={`statico ${color}`}>
        <Icon size={24} strokeWidth={1.8} />
      </span>

      <div>
        <span className="lbl">{title}</span>
        <div className="metric">{value}</div>
        <span className="trend">{description}</span>
      </div>
    </article>
  );
}

export default StatCard;