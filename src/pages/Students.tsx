import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { Student } from '../api'
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../api'

const Students: React.FC = () => {
  const [items, setItems] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Student>>({})

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await getStudents()
      setItems(data || [])
    } catch {
      toast.error('Erro ao carregar estudantes')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast.warning('Nome e sobrenome do estudante são obrigatórios')
      return
    }

    try {
      if (editingId) {
        await updateStudent(editingId, formData)
        toast.success('Estudante atualizado com sucesso!')
      } else {
        await createStudent(formData as Student)
        toast.success('Estudante adicionado com sucesso!')
      }
      resetForm()
      load()
    } catch {
      toast.error(editingId ? 'Erro ao atualizar estudante' : 'Erro ao adicionar estudante')
    }
  }

  const startEdit = (s: Student) => {
    setEditingId(s.id ?? null)
    setFormData(s)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!window.confirm('Confirmar exclusão do estudante?')) return
    try {
      await deleteStudent(id)
      toast.success('Estudante excluído com sucesso!')
      load()
    } catch {
      toast.error('Erro ao excluir estudante')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({})
  }

  return (
    <div>
      <h2>Estudantes</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="firstName"
          placeholder="Primeiro Nome"
          value={formData.firstName || ''}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Sobrenome"
          value={formData.lastName || ''}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email || ''}
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
        <p>Nenhum estudante encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Primeiro Nome</th>
              <th>Sobrenome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.firstName}</td>
                <td>{s.lastName}</td>
                <td>{s.email || '-'}</td>
                <td>
                  <button onClick={() => startEdit(s)}>✏️</button>
                  <button onClick={() => handleDelete(s.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Students
