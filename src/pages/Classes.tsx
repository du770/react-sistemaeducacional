import React, { useEffect, useState } from 'react'
import type { ClassEntity, Course } from '../api'
import { getClasses, createClass, updateClass, deleteClass, getCourses } from '../api'

const Classes: React.FC = () => {
  const [items, setItems] = useState<ClassEntity[]>([])
  const [name, setName] = useState('')
  const [courseId, setCourseId] = useState<number | undefined>(undefined)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => { load(); loadCourses() }, [])

  const load = async () => {
    try {
      const data = await getClasses()
      setItems(data || [])
    } catch (e) { console.error(e); alert('Erro ao carregar turmas') }
  }

  const loadCourses = async () => {
    try { const cs = await getCourses(); setCourses(cs || []) } catch (e) { console.error(e) }
  }

  const handleAdd = async () => {
    if (!name.trim()) return
    try {
      await createClass({ name, courseId })
      setName('')
      setCourseId(undefined)
      load()
    } catch (e) { console.error(e); alert('Erro ao criar turma') }
  }

  const startEdit = (c: ClassEntity) => { setEditingId(c.id ?? null); setName(c.name); setCourseId(c.courseId) }

  const handleSave = async () => {
    if (!editingId) return handleAdd()
    try { await updateClass(editingId, { name, courseId }); setEditingId(null); setName(''); setCourseId(undefined); load() } catch (e) { console.error(e); alert('Erro ao atualizar turma') }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Confirmar exclusão da turma?')) return
    try { await deleteClass(id); load() } catch (e) { console.error(e); alert('Erro ao excluir turma') }
  }

  return (
    <div>
      <h2>Turmas</h2>
      <div style={{ marginBottom: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da turma" />
        <select value={courseId ?? ''} onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : undefined)} style={{ marginLeft: 8 }}>
          <option value="">-- Selecionar curso --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={editingId ? handleSave : handleAdd} style={{ marginLeft: 8 }}>{editingId ? 'Salvar' : 'Adicionar'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setName(''); setCourseId(undefined) }} style={{ marginLeft: 8 }}>Cancelar</button>}
      </div>

      <table style={{ width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Curso</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{courses.find(c => c.id === t.courseId)?.name ?? '-'}</td>
              <td>
                <button onClick={() => startEdit(t)}>Editar</button>
                <button onClick={() => handleDelete(t.id)} style={{ marginLeft: 8 }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Classes
