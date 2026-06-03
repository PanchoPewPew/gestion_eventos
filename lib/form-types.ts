export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "single_select"
  | "multi_select"
  | "dropdown"
  | "file"
  | "checkbox"
  | "url"
  | "rut"

export interface FieldOption {
  id: string
  label: string
}

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  minSelections?: number
  maxSelections?: number
  allowedFileTypes?: string[]
  maxFileSize?: number // in MB
  pattern?: string
  patternMessage?: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  description?: string
  placeholder?: string
  options?: FieldOption[]
  validation: FieldValidation
  order: number
}

export interface FormSettings {
  isActive: boolean
  openDate?: string
  closeDate?: string
  confirmationMessage: string
  capacityFullMessage: string
  duplicateValidationField?: "email" | "rut" | "phone"
  allowWaitlist: boolean
}

export interface EventInfo {
  id: string
  name: string
  description: string
  projectName: string
  modality: "presencial" | "online" | "hibrido"
  location?: string
  capacity: number
  registeredCount: number
  waitlistCount: number
  startDate: string
  endDate: string
  status: "borrador" | "publicado" | "cupo_completo" | "cerrado" | "finalizado" | "cancelado"
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  settings: FormSettings
  event?: EventInfo
  createdAt: string
  updatedAt: string
}

export interface FormSubmission {
  id: string
  formId: string
  eventId?: string
  answers: Record<string, unknown>
  status: "confirmado" | "en_espera" | "rechazado" | "cancelado" | "asistio" | "no_asistio"
  createdAt: string
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  short_text: "Texto corto",
  long_text: "Texto largo",
  email: "Correo electrónico",
  phone: "Teléfono",
  number: "Número",
  date: "Fecha",
  single_select: "Selección única",
  multi_select: "Selección múltiple",
  dropdown: "Lista desplegable",
  file: "Archivo adjunto",
  checkbox: "Casilla de verificación",
  url: "URL",
  rut: "RUT",
}

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
  short_text: "Type",
  long_text: "AlignLeft",
  email: "Mail",
  phone: "Phone",
  number: "Hash",
  date: "Calendar",
  single_select: "CircleDot",
  multi_select: "CheckSquare",
  dropdown: "ChevronDown",
  file: "Paperclip",
  checkbox: "Square",
  url: "Link",
  rut: "CreditCard",
}
