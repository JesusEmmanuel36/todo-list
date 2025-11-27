import { clientPromise } from "../db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("TODOLIST");
  const collection = db.collection("TASKS");

  try {
    switch (req.method) {
      case "GET":
        // Obtener todas las tareas
        const tareas = await collection.find({}).toArray();
        res.status(200).json(tareas);
        break;

      case "POST":
        // Añadir nueva tarea
        const { nombre, activo } = req.body;
        if (!nombre) return res.status(400).json({ error: "Falta nombre" });

        const nuevaTarea = { nombre, activo: activo || false };
        const insertResult = await collection.insertOne(nuevaTarea);

        res.status(201).json({ ...nuevaTarea, _id: insertResult.insertedId });
        break;

      case "PUT":
        // Editar tarea (nombre o activo)
        const { id, nombreNuevo, activoNuevo } = req.body;
        if (!id) return res.status(400).json({ error: "Falta id" });

        const updateFields = {};
        if (nombreNuevo !== undefined) updateFields.nombre = nombreNuevo;
        if (activoNuevo !== undefined) updateFields.activo = activoNuevo;

        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        res.status(200).json({ mensaje: "Tarea actualizada" });
        break;

      case "DELETE":
        // Eliminar tarea
        const { id: deleteId } = req.body;
        if (!deleteId) return res.status(400).json({ error: "Falta id" });

        await collection.deleteOne({ _id: new ObjectId(deleteId) });
        res.status(200).json({ mensaje: "Tarea eliminada" });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
