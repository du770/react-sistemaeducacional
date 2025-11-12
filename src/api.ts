export const API_BASE = 'https://api-estudo-educacao-1.onrender.com'

// ==================== TYPES ====================
export type Student = {
  id?: number
  firstName: string
  lastName: string
  email?: string
  enrollmentDate?: string
}

export type Teacher = {
  id?: number
  name: string
  email?: string
  phone?: string
  department?: string
  specialization?: string
  cpf?: string
}

export type Course = {
  id?: number
  name: string
  description?: string
  credits?: number
  department?: string
  hours?: number
}

export type Grade = {
  id?: number
  studentId: number
  courseId: number
  prova: number
  trabalho: number
  average?: number
}

export type Enrollment = {
  id?: number
  studentId: number
  courseId: number
  enrollmentDate: string
  status?: string
  grade?: number
  teacherId?: number
}

// ==================== REQUEST HELPER ====================
async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
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

// ==================== STUDENTS ====================
export const getStudents = () => request<Student[]>('/students')
export const getStudent = (id: number) => request<Student>(`/students/${id}`)
export const createStudent = (s: Student) =>
  request<Student>('/students', { method: 'POST', body: JSON.stringify(s) })
export const updateStudent = (id: number, s: Partial<Student>) =>
  request<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(s) })
export const deleteStudent = (id: number) =>
  request(`/students/${id}`, { method: 'DELETE' })

// ==================== TEACHERS ====================
export const getTeachers = () => request<Teacher[]>('/teachers')
export const getTeacher = (id: number) => request<Teacher>(`/teachers/${id}`)
export const createTeacher = (t: Teacher) =>
  request<Teacher>('/teachers', { method: 'POST', body: JSON.stringify(t) })
export const updateTeacher = (id: number, t: Partial<Teacher>) =>
  request<Teacher>(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(t) })
export const deleteTeacher = (id: number) =>
  request(`/teachers/${id}`, { method: 'DELETE' })

// ==================== COURSES ====================
export const getCourses = () => request<Course[]>('/courses')
export const getCourse = (id: number) => request<Course>(`/courses/${id}`)
export const createCourse = (c: Course) =>
  request<Course>('/courses', { method: 'POST', body: JSON.stringify(c) })
export const updateCourse = (id: number, c: Partial<Course>) =>
  request<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(c) })
export const deleteCourse = (id: number) =>
  request(`/courses/${id}`, { method: 'DELETE' })

// ==================== GRADES ====================
export const getGrades = () => request<Grade[]>('/grades')
export const getGrade = (id: number) => request<Grade>(`/grades/${id}`)
export const createGrade = (g: Grade) =>
  request<Grade>('/grades', { method: 'POST', body: JSON.stringify(g) })
export const updateGrade = (id: number, g: Partial<Grade>) =>
  request<Grade>(`/grades/${id}`, { method: 'PUT', body: JSON.stringify(g) })
export const deleteGrade = (id: number) =>
  request(`/grades/${id}`, { method: 'DELETE' })

// ==================== ENROLLMENTS ====================
export const getEnrollments = () => request<Enrollment[]>('/enrollments')
export const getEnrollment = (id: number) => request<Enrollment>(`/enrollments/${id}`)
export const createEnrollment = (e: Enrollment) =>
  request<Enrollment>('/enrollments', { method: 'POST', body: JSON.stringify(e) })
export const updateEnrollment = (id: number, e: Partial<Enrollment>) =>
  request<Enrollment>(`/enrollments/${id}`, { method: 'PUT', body: JSON.stringify(e) })
export const deleteEnrollment = (id: number) =>
  request(`/enrollments/${id}`, { method: 'DELETE' })
