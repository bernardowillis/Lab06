import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const ROLES = ["admin", "operador"];

export default function UsersCrud() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: "", correo: "", rol: "operador" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const usersCol = collection(db, "users");
    const unsub = onSnapshot(usersCol, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
      setUsers(list);
    });
    return () => unsub();
  }, []);

  const createUser = async () => {
    if (!form.nombre.trim() || !form.correo.trim()) return;
    await addDoc(collection(db, "users"), {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      rol: form.rol,
      createdAt: serverTimestamp(),
    });
    resetForm();
  };

  const updateUser = async () => {
    if (!form.nombre.trim() || !form.correo.trim() || !editId) return;
    await updateDoc(doc(db, "users", editId), {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      rol: form.rol,
    });
    resetForm();
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    if (editId === id) resetForm();
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setForm({ id: u.id, nombre: u.nombre || "", correo: u.correo || "", rol: u.rol || "operador" });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ id: null, nombre: "", correo: "", rol: "operador" });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Usuarios (Firestore)</h2>

        <div style={styles.form}>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Correo"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            style={styles.input}
          />
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            style={styles.input}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {!editId ? (
            <button onClick={createUser} style={styles.btnPrimary}>Agregar</button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={updateUser} style={styles.btnPrimary}>Guardar</button>
              <button onClick={resetForm} style={styles.btnLight}>Cancelar</button>
            </div>
          )}
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Correo</th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 12 }}>Sin usuarios</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.nombre}</td>
                  <td style={styles.td}>{u.correo}</td>
                  <td style={styles.td}>{u.rol}</td>
                  <td style={styles.td}>
                    <button onClick={() => startEdit(u)} style={styles.btnMini}>Editar</button>
                    <button onClick={() => deleteUser(u.id)} style={styles.btnDanger}>Borrar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "white",
  },
};
