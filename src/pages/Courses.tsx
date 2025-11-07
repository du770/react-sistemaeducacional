import React, { useEffect, useState } from 'react'
import type { Course } from '../api'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api'

const Courses: React.FC = () => {
  const [items, setItems] = useState<Course[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getCourses()
      setItems(data || [])
    } catch (e) {
      console.error(e)
      alert('Erro ao carregar cursos')
    }
  }

  const handleAdd = async () => {
    if (!name.trim()) return
    try {
      await createCourse({ name })
      setName('')
      load()
    } catch (e) {
      console.error(e)
      alert('Erro ao criar curso')
    }
  }

  const startEdit = (c: Course) => {
    setEditingId(c.id ?? null)
    setName(c.name)
  }

  const handleSave = async () => {
    if (!editingId) return handleAdd()
    try {
      await updateCourse(editingId, { name })
      setEditingId(null)
      setName('')
      load()
    } catch (e) {
      console.error(e)
      alert('Erro ao atualizar curso')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Confirmar exclusão do curso?')) return
    try {
      await deleteCourse(id)
      load()
    } catch (e) {
      console.error(e)
      alert('Erro ao excluir curso')
    }
  }

  return (
    <div>
      <h2>Cursos</h2>
      <div className="form-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do curso" />
        <button onClick={editingId ? handleSave : handleAdd} style={{ marginLeft: 8 }}>
          {editingId ? 'Salvar' : 'Adicionar'}
        </button>
        {editingId && (
          <button onClick={() => { setEditingId(null); setName('') }} style={{ marginLeft: 8 }}>Cancelar</button>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>ID</th>
            <th style={{ textAlign: 'left' }}>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button onClick={() => startEdit(c)}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Courses
