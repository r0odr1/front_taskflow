function PlaceholderPage({ title, description }) {
  return (
    <>
      <div className="pagehead">
        <div>
          <h1>{title}</h1>
          <p className="sub">{description}</p>
        </div>
      </div>

      <section className="panel">
        <h2>{title}</h2>

        <p className="sub">
          Seccion de componentes y funcionalidades.
        </p>
      </section>
    </>
  );
}

export default PlaceholderPage;