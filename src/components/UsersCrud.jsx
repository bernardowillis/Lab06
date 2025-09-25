import { useEffect, useState } from "react";

const ROLES = ["admin", "operador"];

const seed = [
  { id: 1, nombre: "Bernardo",    correo: "bernardo@softek.com",    rol: "admin" },
  { id: 2, nombre: "Alejandro",    correo: "alejandro@softek.com",  rol: "operador" },
  { id: 3, nombre: "Adrían",    correo: "adrian@softek.com",    rol: "opeardor" },
  { id: 4, nombre: "Felipe",    correo: "felipe@softek.com",  rol: "operador" },
  { id: 5, nombre: "Armando",    correo: "armando@softek.com",    rol: "operador" },
];

export default function UsersCrud() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : seed;
  });

  const [form, setForm] = useState({ id: null, nombre: "", correo: "", rol: "operador" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

   const createUser = () => {
    if (!form.nombre.trim() || !form.correo.trim()) return;
    const newUser = { ...form, id: Date.now() };
    setUsers((prev) => [...prev, newUser]);
    resetForm();
  };

  const updateUser = () => {
    if (!form.nombre.trim() || !form.correo.trim()) return;
    setUsers((prev) => prev.map((u) => (u.id === editId ? { ...form, id: editId } : u)));
    resetForm();
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editId === id) resetForm();
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setForm({ id: u.id, nombre: u.nombre, correo: u.correo, rol: u.rol });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ id: null, nombre: "", correo: "", rol: "operador" });
  };

  return (
    <div style={styles.page}>
      <div>
        <h2 style={{ marginTop: 0 }}>Usuarios Reto</h2>

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "black",
  },
};

