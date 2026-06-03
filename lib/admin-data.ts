// Mock data for the admin panel - replace with real API calls later

export interface AdminForm {
  id: string
  title: string
  description: string
  eventName: string
  status: 'active' | 'draft' | 'closed'
  responses: number
  capacity: number
  createdAt: string
  updatedAt: string
}

export interface AdminEvent {
  id: string
  name: string
  description: string
  project: string
  modality: 'presencial' | 'virtual' | 'hibrido'
  location: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  formId: string | null
  registrations: number
  capacity: number
}

export interface Registration {
  id: string
  formId: string
  formTitle: string
  eventName: string
  submittedAt: string
  status: 'confirmed' | 'pending' | 'waitlist' | 'cancelled'
  data: Record<string, string | string[]>
}

export const mockForms: AdminForm[] = [
  {
    id: '1',
    title: 'Inscripcion Taller de React',
    description: 'Formulario de inscripcion para el taller de React Avanzado',
    eventName: 'Taller React Avanzado 2024',
    status: 'active',
    responses: 45,
    capacity: 50,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Registro Conferencia Tech',
    description: 'Registro para la conferencia anual de tecnologia',
    eventName: 'TechConf 2024',
    status: 'active',
    responses: 280,
    capacity: 500,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
  },
  {
    id: '3',
    title: 'Workshop UX/UI',
    description: 'Inscripcion al workshop de diseno de interfaces',
    eventName: 'Workshop UX/UI Design',
    status: 'draft',
    responses: 0,
    capacity: 30,
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
  },
  {
    id: '4',
    title: 'Hackathon 2024',
    description: 'Registro de equipos para el hackathon anual',
    eventName: 'Hackathon Innovacion 2024',
    status: 'closed',
    responses: 120,
    capacity: 120,
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-05T23:59:00Z',
  },
  {
    id: '5',
    title: 'Curso Python Basico',
    description: 'Inscripcion al curso introductorio de Python',
    eventName: 'Python para Principiantes',
    status: 'active',
    responses: 18,
    capacity: 25,
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-21T10:45:00Z',
  },
]

export const mockEvents: AdminEvent[] = [
  {
    id: '1',
    name: 'Taller React Avanzado 2024',
    description: 'Aprende patrones avanzados de React incluyendo Server Components y Suspense',
    project: 'Capacitacion Tech',
    modality: 'presencial',
    location: 'Sala de Conferencias A',
    startDate: '2024-02-15T09:00:00Z',
    endDate: '2024-02-15T17:00:00Z',
    status: 'upcoming',
    formId: '1',
    registrations: 45,
    capacity: 50,
  },
  {
    id: '2',
    name: 'TechConf 2024',
    description: 'Conferencia anual de tecnologia con speakers internacionales',
    project: 'Eventos Corporativos',
    modality: 'hibrido',
    location: 'Centro de Convenciones',
    startDate: '2024-03-20T08:00:00Z',
    endDate: '2024-03-22T18:00:00Z',
    status: 'upcoming',
    formId: '2',
    registrations: 280,
    capacity: 500,
  },
  {
    id: '3',
    name: 'Workshop UX/UI Design',
    description: 'Workshop practico de diseno de interfaces y experiencia de usuario',
    project: 'Capacitacion Diseno',
    modality: 'virtual',
    location: 'Zoom',
    startDate: '2024-02-28T14:00:00Z',
    endDate: '2024-02-28T18:00:00Z',
    status: 'upcoming',
    formId: '3',
    registrations: 0,
    capacity: 30,
  },
  {
    id: '4',
    name: 'Hackathon Innovacion 2024',
    description: '48 horas de innovacion y desarrollo de soluciones tecnologicas',
    project: 'Innovacion',
    modality: 'presencial',
    location: 'Campus Principal',
    startDate: '2024-01-20T09:00:00Z',
    endDate: '2024-01-22T17:00:00Z',
    status: 'completed',
    formId: '4',
    registrations: 120,
    capacity: 120,
  },
  {
    id: '5',
    name: 'Python para Principiantes',
    description: 'Curso introductorio de programacion con Python',
    project: 'Capacitacion Tech',
    modality: 'virtual',
    location: 'Google Meet',
    startDate: '2024-02-05T10:00:00Z',
    endDate: '2024-02-26T12:00:00Z',
    status: 'ongoing',
    formId: '5',
    registrations: 18,
    capacity: 25,
  },
]

export const mockRegistrations: Registration[] = [
  {
    id: '1',
    formId: '1',
    formTitle: 'Inscripcion Taller de React',
    eventName: 'Taller React Avanzado 2024',
    submittedAt: '2024-01-20T14:30:00Z',
    status: 'confirmed',
    data: {
      nombre: 'Juan Carlos Perez',
      email: 'juan.perez@email.com',
      telefono: '+56 9 1234 5678',
      empresa: 'Tech Solutions',
      experiencia: 'Intermedio',
    },
  },
  {
    id: '2',
    formId: '1',
    formTitle: 'Inscripcion Taller de React',
    eventName: 'Taller React Avanzado 2024',
    submittedAt: '2024-01-19T11:20:00Z',
    status: 'confirmed',
    data: {
      nombre: 'Maria Gonzalez',
      email: 'maria.gonzalez@email.com',
      telefono: '+56 9 8765 4321',
      empresa: 'StartupX',
      experiencia: 'Avanzado',
    },
  },
  {
    id: '3',
    formId: '2',
    formTitle: 'Registro Conferencia Tech',
    eventName: 'TechConf 2024',
    submittedAt: '2024-01-22T09:15:00Z',
    status: 'pending',
    data: {
      nombre: 'Pedro Rodriguez',
      email: 'pedro.rodriguez@email.com',
      telefono: '+56 9 5555 1234',
      empresa: 'Digital Agency',
      tipoEntrada: 'VIP',
    },
  },
  {
    id: '4',
    formId: '1',
    formTitle: 'Inscripcion Taller de React',
    eventName: 'Taller React Avanzado 2024',
    submittedAt: '2024-01-21T16:45:00Z',
    status: 'waitlist',
    data: {
      nombre: 'Ana Martinez',
      email: 'ana.martinez@email.com',
      telefono: '+56 9 4444 5678',
      empresa: 'Innovate Corp',
      experiencia: 'Principiante',
    },
  },
  {
    id: '5',
    formId: '4',
    formTitle: 'Hackathon 2024',
    eventName: 'Hackathon Innovacion 2024',
    submittedAt: '2024-01-05T23:30:00Z',
    status: 'confirmed',
    data: {
      nombreEquipo: 'Code Warriors',
      lider: 'Carlos Silva',
      email: 'carlos.silva@email.com',
      miembros: ['Ana Lopez', 'Pedro Gomez', 'Laura Chen'],
      categoria: 'Sostenibilidad',
    },
  },
  {
    id: '6',
    formId: '5',
    formTitle: 'Curso Python Basico',
    eventName: 'Python para Principiantes',
    submittedAt: '2024-01-21T10:00:00Z',
    status: 'confirmed',
    data: {
      nombre: 'Sofia Herrera',
      email: 'sofia.herrera@email.com',
      telefono: '+56 9 3333 2222',
      ocupacion: 'Estudiante',
      motivacion: 'Aprender programacion para analisis de datos',
    },
  },
]

export const dashboardStats = {
  totalForms: mockForms.length,
  activeForms: mockForms.filter((f) => f.status === 'active').length,
  totalEvents: mockEvents.length,
  upcomingEvents: mockEvents.filter((e) => e.status === 'upcoming').length,
  totalRegistrations: mockRegistrations.length,
  pendingRegistrations: mockRegistrations.filter((r) => r.status === 'pending').length,
  totalCapacity: mockEvents.reduce((sum, e) => sum + e.capacity, 0),
  totalOccupancy: mockEvents.reduce((sum, e) => sum + e.registrations, 0),
}
