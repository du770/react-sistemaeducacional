export const API_BASE = 'https://api-estudo-educacao-1.onrender.com'

export type Course = { id?: number; name: string }
export type ClassEntity = { id?: number; name: string; courseId?: number }
export type Student = { id?: number; name: string; classId?: number }
export type Grade = { id?: number; studentId: number; prova: number; trabalho: number }

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T | null> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText} - ${text}`)
  }
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

/* ========= COURSES ========= */
export const getCourses = () => request<Course[]>('/courses')
export const createCourse = (c: Course) =>
  request('/courses', { method: 'POST', body: JSON.stringify(c) })
export const updateCourse = (id: number, c: Partial<Course>) =>
  request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(c) })
export const deleteCourse = (id: number) =>
  request(`/courses/${id}`, { method: 'DELETE' })

/* ========= CLASSES ========= */
export const getClasses = () => request<ClassEntity[]>('/classes')
export const createClass = (c: ClassEntity) =>
  request('/classes', { method: 'POST', body: JSON.stringify(c) })
export const updateClass = (id: number, c: Partial<ClassEntity>) =>
  request(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(c) })
export const deleteClass = (id: number) =>
  request(`/classes/${id}`, { method: 'DELETE' })

/* ========= STUDENTS ========= */
export const getStudents = () => request<Student[]>('/students')
export const createStudent = (s: Student) =>
  request('/students', { method: 'POST', body: JSON.stringify(s) })
export const updateStudent = (id: number, s: Partial<Student>) =>
  request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(s) })
export const deleteStudent = (id: number) =>
  request(`/students/${id}`, { method: 'DELETE' })

/* ========= GRADES ========= */
export const getGrades = () => request<Grade[]>('/grades')
export const createGrade = (g: Grade) =>
  request('/grades', { method: 'POST', body: JSON.stringify(g) })
export const updateGrade = (id: number, g: Partial<Grade>) =>
  request(`/grades/${id}`, { method: 'PUT', body: JSON.stringify(g) })
export const deleteGrade = (id: number) =>
  request(`/grades/${id}`, { method: 'DELETE' })
