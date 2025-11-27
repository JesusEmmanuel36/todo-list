import { useEffect, useState } from "react";
import Tarea from "./components/Tarea";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [selection, setSelection] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [activeEditor, setEditor] = useState(false);

  // 🔹 Cargar tareas desde la API al iniciar
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const res = await fetch("/api/tareas");
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      }
    };
    fetchTareas();
  }, []);

  // 🔹 Añadir tarea
  const añadirTarea = async () => {
    if (nombre.trim() === "") return;
    try {
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, activo: false }),
      });
      const nueva = await res.json();
      setTareas([...tareas, nueva]);
      setNombre("");
    } catch (error) {
      console.error("Error al añadir tarea:", error);
    }
  };

  // 🔹 Eliminar tarea
  const removerTarea = async (id) => {
    try {
      await fetch("/api/tareas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTareas(tareas.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // 🔹 Editar tarea (nombre)
  const editarTarea = async (id, nombreNuevo) => {
    try {
      await fetch("/api/tareas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombreNuevo }),
      });
      setTareas(
        tareas.map((t) => (t._id === id ? { ...t, nombre: nombreNuevo } : t))
      );
    } catch (error) {
      console.error("Error al editar tarea:", error);
    }
  };

  // 🔹 Cambiar activo
  const toggleActivo = async (id, valorActivo) => {
    try {
      await fetch("/api/tareas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, activoNuevo: valorActivo }),
      });
      setTareas(
        tareas.map((t) => (t._id === id ? { ...t, activo: valorActivo } : t))
      );
    } catch (error) {
      console.error("Error al cambiar activo:", error);
    }
  };

  const editorHandler = () => setEditor(!activeEditor);
  const selectionHandler = (tarea) => setSelection(tarea);

  return (
    <>
      <section className="Todo-Section">
        <h1>Todo List</h1>
        <input
          id="AñadirInput"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button className="Añadir" onClick={añadirTarea}>
          Añadir
        </button>

        <div className="Tareas-Container">
          {tareas.map((t) => (
            <Tarea
              key={t._id}
              Nombre={selection === t.nombre ? selection : t.nombre}
              activo={t.activo} // 🔹 ahora se pasa desde DB
              OnDelete={() => removerTarea(t._id)}
              OnEdit={() => {
                editorHandler();
                selectionHandler(t.nombre);
              }}
              OnSelect={(valorActivo) => toggleActivo(t._id, valorActivo)}
            />
          ))}
        </div>
      </section>

      <section className={activeEditor ? "overlay activo" : "overlay"}></section>

      <section className={activeEditor ? "editor activo" : "editor"}>
        <h2 className="EditarTarea">Editar Tarea</h2>
        <input
          type="text"
          placeholder={selection || "Nombre"}
          id="NameInput"
        />
        <div className="GuardarCerrar">
          <button
            className="Guardar"
            onClick={() => {
              const input = document.getElementById("NameInput");
              if (input.value !== "") {
                const tarea = tareas.find((t) => t.nombre === selection);
                if (tarea) {
                  editarTarea(tarea._id, input.value);
                  setSelection(input.value);
                }
                editorHandler();
                input.value = "";
              }
            }}
          >
            Guardar
          </button>
          <button
            className="Cerrar"
            onClick={() => {
              const input = document.getElementById("NameInput");
              input.value = "";
              editorHandler();
              selectionHandler("");
            }}
          >
            Cerrar
          </button>
        </div>
      </section>
    </>
  );
}
