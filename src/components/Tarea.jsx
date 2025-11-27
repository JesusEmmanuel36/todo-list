export default function Tarea({ Nombre, OnDelete, OnEdit, OnSelect, activo }) {

  const activeHandler = (e) => {
    e.stopPropagation();
    OnSelect(!activo);
  };

  return (
    <div className="Tarea">
      <div className="MarcadorYnombre">
        <button
          className={activo ? "Marcador Activo" : "Marcador"}
          onClick={activeHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
          </svg>
        </button>
        <h2 className={activo ? "h2 Activo" : "h2"}>{Nombre}</h2>
      </div>

      <div className="BotonesHolder">
        <button
          className="Editar"
          onClick={(e) => { e.stopPropagation(); OnEdit(); }}
        >
          Editar
        </button>
        <button
          className="Eliminar"
          onClick={(e) => { e.stopPropagation(); OnDelete(); }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
