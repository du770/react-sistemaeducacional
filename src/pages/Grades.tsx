import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Course, Grade } from '../api'
import { getCourses, getGrades, updateGrade } from '../api'

const Grades: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) loadGrades(selectedCourseId)
  }, [selectedCourseId])

  const loadCourses = async () => {
    try {
      const cs = await getCourses()
      setCourses(cs || [])
    } catch {
      toast.error('Erro ao carregar cursos')
    }
  }

  const loadGrades = async (courseId: number) => {
    setLoading(true)
    try {
      const gs = await getGrades()
      const filtered = (gs || []).filter(g => g.courseId === courseId)
      setGrades(filtered)
    } catch {
      toast.error('Erro ao carregar notas')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (gradeId: number | undefined, field: 'prova' | 'trabalho', value: number) => {
    setGrades(prev =>
      prev.map(g => (g.id === gradeId ? { ...g, [field]: value } : g))
    )
  }

  const handleSave = async (gradeId: number | undefined) => {
    if (!gradeId) return
    const g = grades.find(x => x.id === gradeId)
    if (!g) return
    try {
      await updateGrade(gradeId, { prova: g.prova, trabalho: g.trabalho })
      toast.success('Nota salva com sucesso!')
      loadGrades(selectedCourseId!)
    } catch {
      toast.error('Erro ao salvar nota')
    }
  }

  const calculateAverage = () => {
    if (grades.length === 0) return 0
    const soma = grades.reduce((acc, g) => acc + (g.prova + g.trabalho) / 2, 0)
    return (soma / grades.length).toFixed(2)
  }


  const exportToPDF = () => {
    const course = courses.find(c => c.id === selectedCourseId)?.name || 'Relatório'
    const doc = new jsPDF()
    doc.text(`Relatório de Notas - ${course}`, 14, 20)
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Estudante', 'Prova', 'Trabalho', 'Média']],
      body: grades.map(g => [
        String(g.id),
        `Estudante ${g.studentId}`,
        String(g.prova),
        String(g.trabalho),
        ((g.prova + g.trabalho) / 2).toFixed(2),
      ]),
      didDrawPage: function(data) {
        const pageInfo = data as { cursor: { y: number } }
        doc.text(`Média do Curso: ${calculateAverage()}`, 14, pageInfo.cursor.y + 10)
      },
    })
    doc.save(`Relatorio_Notas_${course}.pdf`)
  }

  const exportToExcel = () => {
    const course = courses.find(c => c.id === selectedCourseId)?.name || 'Relatório'
    const data = grades.map(g => ({
      ID: g.id,
      'Estudante ID': g.studentId,
      Prova: g.prova,
      Trabalho: g.trabalho,
      Média: ((g.prova + g.trabalho) / 2).toFixed(2),
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Notas')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `Relatorio_Notas_${course}.xlsx`)
  }

  return (
    <div>
      <h2>Notas</h2>

      <div className="form-row">
        <select
          value={selectedCourseId ?? ''}
          onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">-- Selecionar Curso --</option>
          {courses.map(c => (
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

      {!loading && selectedCourseId && (
        <>
          {grades.length === 0 ? (
            <p>Nenhuma nota encontrada para este curso.</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Estudante ID</th>
                    <th>Prova</th>
                    <th>Trabalho</th>
                    <th>Média</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map(g => {
                    const media = ((g.prova + g.trabalho) / 2).toFixed(2)
                    return (
                      <tr key={g.id}>
                        <td>{g.id}</td>
                        <td>{g.studentId}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={g.prova}
                            onChange={(e) =>
                              handleChange(g.id, 'prova', Number(e.target.value))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={g.trabalho}
                            onChange={(e) =>
                              handleChange(g.id, 'trabalho', Number(e.target.value))
                            }
                          />
                        </td>
                        <td>{media}</td>
                        <td>
                          <button onClick={() => handleSave(g.id)}>Salvar</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="average-box">
                <strong>Média do Curso:</strong> {calculateAverage()}
              </div>

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
