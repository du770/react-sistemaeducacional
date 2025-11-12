import React, { useEffect, useState } from 'react'
import type { Course } from '../api'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../api'

const Classes: React.FC = () => {
  const [items, setItems] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Course>>({})

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await getCourses()
      setItems(data || [])
    } catch (e) {
      console.error(e)
      alert('Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) return

    try {
      if (editingId) {
        await updateCourse(editingId, formData)
      } else {
        await createCourse(formData as Course)
      }
      resetForm()
      load()
    } catch (e) {
      console.error(e)
      alert(editingId ? 'Erro ao atualizar curso' : 'Erro ao criar curso')
    }
  }

  const startEdit = (c: Course) => {
    setEditingId(c.id ?? null)
    setFormData(c)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!window.confirm('Confirmar exclusão do curso?')) return
    try {
      await deleteCourse(id)
      load()
    } catch (e) {
      console.error(e)
      alert('Erro ao excluir curso')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({})
  }

  return (
    <div>
      <h2>Turmas / Cursos</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Nome do curso"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descrição (opcional)"
          value={formData.description || ''}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="credits"
          placeholder="Créditos"
          value={formData.credits || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Departamento"
          value={formData.department || ''}
          onChange={handleInputChange}
        />
        <button type="submit">
          {editingId ? '✏️ Salvar' : '➕ Adicionar'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            ❌ Cancelar
          </button>
        )}
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Carregando...</p>
        </div>
      )}

      {!loading && items.length === 0 ? (
        <p>Nenhum curso encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Créditos</th>
              <th>Departamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.description || '-'}</td>
                <td>{c.credits || '-'}</td>
                <td>{c.department || '-'}</td>
                <td>
                  <button onClick={() => startEdit(c)}>✏️</button>
                  <button onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Classes
