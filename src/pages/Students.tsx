import React, { useEffect, useState } from 'react'
import type { Student, ClassEntity } from '../api'
import { getStudents, createStudent, updateStudent, deleteStudent, getClasses } from '../api'

const Students: React.FC = () => {
  const [items, setItems] = useState<Student[]>([])
  const [name, setName] = useState('')
  const [classId, setClassId] = useState<number | undefined>(undefined)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [classes, setClasses] = useState<ClassEntity[]>([])

  useEffect(() => { load(); loadClasses() }, [])

  const load = async () => {
    try { const s = await getStudents(); setItems(s || []) } catch (e) { console.error(e); alert('Erro ao carregar estudantes') }
  }

  const loadClasses = async () => {
    try { const c = await getClasses(); setClasses(c || []) } catch (e) { console.error(e) }
  }

  const handleAdd = async () => {
    if (!name.trim()) return
    try { await createStudent({ name, classId }); setName(''); setClassId(undefined); load() } catch (e) { console.error(e); alert('Erro ao criar estudante') }
  }

  const startEdit = (s: Student) => { setEditingId(s.id ?? null); setName(s.name); setClassId(s.classId) }

  const handleSave = async () => {
    if (!editingId) return handleAdd()
    try { await updateStudent(editingId, { name, classId }); setEditingId(null); setName(''); setClassId(undefined); load() } catch (e) { console.error(e); alert('Erro ao atualizar estudante') }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Confirmar exclusão do estudante?')) return
    try { await deleteStudent(id); load() } catch (e) { console.error(e); alert('Erro ao excluir estudante') }
  }

  return (
    <div>
      <h2>Estudantes</h2>
      <div style={{ marginBottom: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do estudante" />
        <select value={classId ?? ''} onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : undefined)} style={{ marginLeft: 8 }}>
          <option value="">-- Selecionar turma --</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={editingId ? handleSave : handleAdd} style={{ marginLeft: 8 }}>{editingId ? 'Salvar' : 'Adicionar'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setName(''); setClassId(undefined) }} style={{ marginLeft: 8 }}>Cancelar</button>}
      </div>

      <table style={{ width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Turma</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {items.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{classes.find(c => c.id === s.classId)?.name ?? '-'}</td>
              <td>
                <button onClick={() => startEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: 8 }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Students
