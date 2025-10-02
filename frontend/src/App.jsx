import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

function App() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ category: '', description: '', amount: '', date: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [useMock, setUseMock] = useState(() => localStorage.getItem('useMock') === 'true')

  const fetchExpenses = async () => {
    setLoading(true)
    setError('')
    try {
      if (useMock) {
        const stored = localStorage.getItem('expenses')
        if (stored) {
          setExpenses(JSON.parse(stored))
        } else {
          const res = await fetch('/mockData.json')
          const data = await res.json()
          setExpenses(data)
          localStorage.setItem('expenses', JSON.stringify(data))
        }
      } else {
        const res = await fetch(`${API_BASE}/api/expenses`)
        const data = await res.json()
        setExpenses(data)
      }
    } catch (e) {
      setError('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [useMock])

  const addExpense = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (useMock) {
        const current = expenses.slice()
        const nextId = (current.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1
        const newItem = { id: nextId, ...payload }
        const updated = [...current, newItem]
        setExpenses(updated)
        localStorage.setItem('expenses', JSON.stringify(updated))
        setForm({ category: '', description: '', amount: '', date: '' })
      } else {
        const res = await fetch(`${API_BASE}/api/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Bad response')
        setForm({ category: '', description: '', amount: '', date: '' })
        await fetchExpenses()
      }
    } catch (e) {
      setError('Failed to add expense')
    }
  }

  const startEdit = (expense) => {
    setEditingId(expense.id)
    setForm({
      category: expense.category || '',
      description: expense.description || '',
      amount: String(expense.amount ?? ''),
      date: expense.date || ''
    })
  }

  const saveEdit = async () => {
    if (!editingId) return
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (useMock) {
        const updated = expenses.map(x => x.id === editingId ? { ...x, ...payload } : x)
        setExpenses(updated)
        localStorage.setItem('expenses', JSON.stringify(updated))
        setEditingId(null)
        setForm({ category: '', description: '', amount: '', date: '' })
      } else {
        const res = await fetch(`${API_BASE}/api/expenses/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Bad response')
        setEditingId(null)
        setForm({ category: '', description: '', amount: '', date: '' })
        await fetchExpenses()
      }
    } catch (e) {
      setError('Failed to save changes')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ category: '', description: '', amount: '', date: '' })
  }

  const deleteExpense = async (id) => {
    try {
      if (useMock) {
        const updated = expenses.filter(x => x.id !== id)
        setExpenses(updated)
        localStorage.setItem('expenses', JSON.stringify(updated))
      } else {
        const res = await fetch(`${API_BASE}/api/expenses/${id}`, { method: 'DELETE' })
        if (!(res.ok || res.status === 204)) {
          const txt = await res.text().catch(() => '')
          throw new Error(txt || 'Delete failed')
        }
        await fetchExpenses()
      }
    } catch (e) {
      setError(`Failed to delete expense: ${e.message}`)
    }
  }

  const chartData = useMemo(() => {
    const map = {}
    for (const exp of expenses) {
      map[exp.category] = (map[exp.category] || 0) + exp.amount
    }
    return Object.entries(map).map(([category, total]) => ({ category, total }))
  }, [expenses])

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>
          <input type="checkbox" checked={useMock} onChange={e => { const v = e.target.checked; setUseMock(v); localStorage.setItem('useMock', String(v)); }} />
          <span style={{ marginLeft: '0.5rem' }}>Use mock data</span>
        </label>
      </div>

      <section className="form-section">
        <h2>Add Expense</h2>
        <form onSubmit={addExpense} className="form-grid">
          <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <input placeholder="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <button type="submit">Add</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="list-section">
        <h2>Expenses {loading && <span className="muted">(loading...)</span>}</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount (R)</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>R {e.amount.toFixed(2)}</td>
                <td>{e.date}</td>
                <td>
                  <button onClick={() => startEdit(e)}>Edit</button>
                  <button onClick={() => deleteExpense(e.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="chart-section">
        <h2>By Category</h2>
        {chartData.length === 0 ? (
          <p className="muted">No data yet. Add expenses to see the chart.</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(v) => `R ${v.toFixed(0)}`} />
                <Tooltip formatter={(v) => [`R ${Number(v).toFixed(2)}`, 'Total']} />
                <Bar dataKey="total" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {editingId && (
        <section className="edit-section">
          <h2>Edit Expense</h2>
          <div className="form-grid">
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            <input placeholder="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <div>
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit} style={{ marginLeft: '0.5rem' }}>Cancel</button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
