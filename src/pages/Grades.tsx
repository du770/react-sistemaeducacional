import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { ClassEntity, Student, Grade } from '../api'
import {
  getClasses,
  getStudents,
  getGrades,
  createGrade,
  updateGrade,
} from '../api'

// 🟩 Importações novas para exportação
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const Grades: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>()
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedClassId) loadStudentsAndGrades(selectedClassId)
  }, [selectedClassId])

  const loadClasses = async () => {
    try {
      const cs = await getClasses()
      setClasses(cs || [])
    } catch {
      toast.error('Erro ao carregar turmas')
    }
  }

  const loadStudentsAndGrades = async (classId: number) => {
    setLoading(true)
    try {
      const allStudents = await getStudents()
      const filtered = (allStudents || []).filter((s) => s.classId === classId)
      setStudents(filtered)
      const gs = await getGrades()
      setGrades(gs || [])
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    studentId: number,
    field: 'prova' | 'trabalho',
    value: number
  ) => {
    setGrades((prev) => {
      const existing = prev.find((g) => g.studentId === studentId)
      if (existing) {
        return prev.map((g) =>
          g.studentId === studentId ? { ...g, [field]: value } : g
        )
      } else {
        const newGrade: Grade = {
          studentId,
          prova: field === 'prova' ? value : 0,
          trabalho: field === 'trabalho' ? value : 0,
        }
        return [...prev, newGrade]
      }
    })
  }

  const handleSave = async (studentId: number) => {
    const g = grades.find((x) => x.studentId === studentId)
    if (!g) return
    try {
      if (g.id) {
        await updateGrade(g.id, { prova: g.prova, trabalho: g.trabalho })
      } else {
        await createGrade({
          studentId: g.studentId,
          prova: g.prova,
          trabalho: g.trabalho,
        })
      }
      toast.success('Nota salva com sucesso!')
      loadStudentsAndGrades(selectedClassId!)
    } catch {
      toast.error('Erro ao salvar nota')
    }
  }

  const findGrade = (studentId: number): Grade | undefined =>
    grades.find((g) => g.studentId === studentId)

  // 📊 Cálculo da média
  const calculateAverage = () => {
    const notasValidas = grades.filter((g) =>
      students.some((s) => s.id === g.studentId)
    )
    if (notasValidas.length === 0) return 0
    const soma = notasValidas.reduce(
      (acc, g) => acc + (g.prova + g.trabalho) / 2,
      0
    )
    return (soma / notasValidas.length).toFixed(2)
  }

  // 🟩 Exportar PDF
  const exportToPDF = () => {
    const turma = classes.find((c) => c.id === selectedClassId)?.name || ''
    const doc = new jsPDF()

    doc.text(`Relatório de Notas - ${turma}`, 14, 20)
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Estudante', 'Prova', 'Trabalho', 'Média']],
      body: students.map((s) => {
        const g = findGrade(s.id!)
        const prova = g?.prova ?? 0
        const trabalho = g?.trabalho ?? 0
        const media = ((prova + trabalho) / 2).toFixed(2)
        return [String(s.id), s.name, String(prova), String(trabalho), media]
      }),
      didDrawPage: function(data) {
        // Use o tipo adequado do jspdf-autotable
        const pageInfo = data as { cursor: { y: number } }
        doc.text(`Média da Turma: ${calculateAverage()}`, 14, pageInfo.cursor.y + 10)
      }
    })
    doc.save(`Relatorio_Notas_${turma}.pdf`)
  }

  // 🟩 Exportar Excel
  const exportToExcel = () => {
    const turma = classes.find((c) => c.id === selectedClassId)?.name || ''
    const data = students.map((s) => {
      const g = findGrade(s.id!)
      const prova = g?.prova ?? 0
      const trabalho = g?.trabalho ?? 0
      const media = ((prova + trabalho) / 2).toFixed(2)
      return {
        ID: s.id,
        Estudante: s.name,
        Prova: prova,
        Trabalho: trabalho,
        Média: media,
      }
    })

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Notas')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `Relatorio_Notas_${turma}.xlsx`)
  }

  return (
    <div>
      <h2>Notas</h2>

      <div className="form-row">
        <select
          value={selectedClassId ?? ''}
          onChange={(e) =>
            setSelectedClassId(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">-- Selecionar turma --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Carregando dados...</p>
        </div>
      )}

      {!loading && selectedClassId && (
        <>
          {students.length === 0 ? (
            <p>Nenhum estudante encontrado nesta turma.</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Estudante</th>
                    <th>Prova</th>
                    <th>Trabalho</th>
                    <th>Média</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const g = findGrade(s.id!)
                    const prova = g?.prova ?? 0
                    const trabalho = g?.trabalho ?? 0
                    const media = ((prova + trabalho) / 2).toFixed(2)
                    return (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.name}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={prova}
                            onChange={(e) =>
                              handleChange(
                                s.id!,
                                'prova',
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={trabalho}
                            onChange={(e) =>
                              handleChange(
                                s.id!,
                                'trabalho',
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>{media}</td>
                        <td>
                          <button onClick={() => handleSave(s.id!)}>
                            Salvar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="average-box">
                <strong>Média da Turma:</strong> {calculateAverage()}
              </div>

              {/* 🟩 Botões de exportação */}
              <div style={{ marginTop: 16 }}>
                <button onClick={exportToPDF}>📄 Exportar PDF</button>
                <button onClick={exportToExcel} style={{ marginLeft: 8 }}>
                  📊 Exportar Excel
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Grades
