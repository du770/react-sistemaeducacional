import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { Enrollment, Student, Course } from '../api'
import {
  getEnrollments,
  getStudents,
  getCourses,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from '../api'

const Enrollments: React.FC = () => {
  const [items, setItems] = useState<Enrollment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Enrollment>>({
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getCourses(),
      ])
      setItems(enrollmentsData || [])
      setStudents(studentsData || [])
      setCourses(coursesData || [])
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget
    setFormData(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'courseId' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.studentId || !formData.courseId || !formData.enrollmentDate) {
      toast.warning('Preencha todos os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await updateEnrollment(editingId, formData)
        toast.success('Matrícula atualizada com sucesso!')
      } else {
        await createEnrollment(formData as Enrollment)
        toast.success('Matrícula adicionada com sucesso!')
      }
      resetForm()
      loadData()
    } catch {
      toast.error(
        editingId ? 'Erro ao atualizar matrícula' : 'Erro ao adicionar matrícula'
      )
    }
  }

  const startEdit = (e: Enrollment) => {
    setEditingId(e.id ?? null)
    setFormData(e)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!window.confirm('Confirmar exclusão da matrícula?')) return
    try {
      await deleteEnrollment(id)
      toast.success('Matrícula excluída com sucesso!')
      loadData()
    } catch {
      toast.error('Erro ao excluir matrícula')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
    })
  }

  const getStudentName = (id: number) => {
    const student = students.find(s => s.id === id)
    return student ? `${student.firstName} ${student.lastName}` : '-'
  }
  const getCourseName = (id: number) => courses.find(c => c.id === id)?.name || '-'

  return (
    <div>
      <h2>Matrículas</h2>

      <form onSubmit={handleSubmit} className="form">
        <select
          name="studentId"
          value={formData.studentId || ''}
          onChange={handleInputChange}
          required
        >
          <option value="">-- Selecionar Estudante --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        <select
          name="courseId"
          value={formData.courseId || ''}
          onChange={handleInputChange}
          required
        >
          <option value="">-- Selecionar Curso --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="enrollmentDate"
          value={formData.enrollmentDate || ''}
          onChange={handleInputChange}
          required
        />

        <select
          name="status"
          value={formData.status || 'active'}
          onChange={handleInputChange}
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="completed">Concluído</option>
          <option value="suspended">Suspenso</option>
        </select>

        <input
          type="number"
          name="grade"
          placeholder="Nota (opcional)"
          value={formData.grade || ''}
          onChange={handleInputChange}
          min="0"
          max="10"
          step="0.1"
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
        <p>Nenhuma matrícula encontrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudante</th>
              <th>Curso</th>
              <th>Data Matrícula</th>
              <th>Status</th>
              <th>Nota</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{getStudentName(e.studentId)}</td>
                <td>{getCourseName(e.courseId)}</td>
                <td>{new Date(e.enrollmentDate).toLocaleDateString('pt-BR')}</td>
                <td>
                  <span className={`status status-${e.status || 'active'}`}>
                    {e.status || 'active'}
                  </span>
                </td>
                <td>{e.grade || '-'}</td>
                <td>
                  <button onClick={() => startEdit(e)}>✏️</button>
                  <button onClick={() => handleDelete(e.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Enrollments
