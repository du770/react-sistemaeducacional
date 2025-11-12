import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { Teacher } from '../api'
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../api'

const Teachers: React.FC = () => {
  const [items, setItems] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Teacher>>({})

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await getTeachers()
      setItems(data || [])
    } catch {
      toast.error('Erro ao carregar professores')
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
    if (!formData.name?.trim()) {
      toast.warning('Nome do professor é obrigatório')
      return
    }

    try {
      if (editingId) {
        await updateTeacher(editingId, formData)
        toast.success('Professor atualizado com sucesso!')
      } else {
        await createTeacher(formData as Teacher)
        toast.success('Professor adicionado com sucesso!')
      }
      resetForm()
      load()
    } catch {
      toast.error(editingId ? 'Erro ao atualizar professor' : 'Erro ao adicionar professor')
    }
  }

  const startEdit = (t: Teacher) => {
    setEditingId(t.id ?? null)
    setFormData(t)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!window.confirm('Confirmar exclusão do professor?')) return
    try {
      await deleteTeacher(id)
      toast.success('Professor excluído com sucesso!')
      load()
    } catch {
      toast.error('Erro ao excluir professor')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({})
  }

  return (
    <div>
      <h2>Professores</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name || ''}
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
        <input
          type="tel"
          name="phone"
          placeholder="Telefone"
          value={formData.phone || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Departamento"
          value={formData.department || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="specialization"
          placeholder="Especialização"
          value={formData.specialization || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={formData.cpf || ''}
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
        <p>Nenhum professor encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Departamento</th>
              <th>Especialização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.email || '-'}</td>
                <td>{t.phone || '-'}</td>
                <td>{t.department || '-'}</td>
                <td>{t.specialization || '-'}</td>
                <td>
                  <button onClick={() => startEdit(t)}>✏️</button>
                  <button onClick={() => handleDelete(t.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Teachers
