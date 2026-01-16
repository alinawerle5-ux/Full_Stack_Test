import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { ShoppingItem } from "./types";

export default function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const remainingCount = useMemo(
    () => items.filter((i) => !i.bought).length,
    [items]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.listItems();
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;

    // optimistic UI
    setName("");
    try {
      const created = await api.createItem(trimmed);
      setItems((prev) => [created, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Konnte Item nicht anlegen");
    }
  }

  async function onToggle(item: ShoppingItem, bought: boolean) {
    // optimistic UI
    setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, bought } : i)));
    try {
      const updated = await api.updateBought(item._id, bought);
      setItems((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
    } catch (e) {
      // revert
      setItems((prev) => prev.map((i) => (i._id === item._id ? item : i)));
      setError(e instanceof Error ? e.message : "Konnte Status nicht ändern");
    }
  }

  async function onDelete(item: ShoppingItem) {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i._id !== item._id));
    try {
      await api.deleteItem(item._id);
    } catch (e) {
      setItems(snapshot);
      setError(e instanceof Error ? e.message : "Konnte Item nicht löschen");
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <img className="brand__icon" src="/img/todo.svg" alt="" />
          <div>
            <h1>Einkaufsliste</h1>
            <p className="sub">{remainingCount} offen · {items.length} gesamt</p>
          </div>
        </div>
      </header>

      <main className="card">
        <div className="add">
          <input
            className="add__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Produktname (z. B. "Butter")'
            onKeyDown={(e) => {
              if (e.key === "Enter") onAdd();
            }}
          />
          <button className="btn" onClick={onAdd}>
            Hinzufügen
          </button>
        </div>

        {error && (
          <div className="error" role="alert" onClick={() => setError(null)}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="state">Lade…</div>
        ) : items.length === 0 ? (
          <div className="state">Noch nichts auf der Liste. Los geht’s 🙂</div>
        ) : (
          <ul className="list">
            {items.map((item) => (
              <li key={item._id} className={`item ${item.bought ? "item--bought" : ""}`}>
                <label className="item__left">
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={(e) => onToggle(item, e.target.checked)}
                  />
                  <span className="item__name">{item.name}</span>
                </label>

                <button className="btn btn--danger" onClick={() => onDelete(item)} aria-label="Löschen">
                  <img src="/img/delete.svg" alt="" />
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="footer">
        <span>React + TypeScript · Express + MongoDB</span>
      </footer>
    </div>
  );
}
