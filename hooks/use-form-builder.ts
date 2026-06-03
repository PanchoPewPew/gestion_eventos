"use client"

import { useState, useCallback } from "react"
import type { Form, FormField, FieldType, FormSettings, EventInfo } from "@/lib/form-types"

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

const defaultSettings: FormSettings = {
  isActive: true,
  confirmationMessage: "Gracias por tu inscripción. Hemos recibido tu registro correctamente.",
  capacityFullMessage: "Lo sentimos, el evento ha alcanzado su capacidad máxima.",
  allowWaitlist: false,
}

const defaultEvent: EventInfo = {
  id: generateId(),
  name: "Nuevo Evento",
  description: "",
  projectName: "Mi Proyecto",
  modality: "presencial",
  capacity: 50,
  registeredCount: 0,
  waitlistCount: 0,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  status: "borrador",
}

export function useFormBuilder(initialForm?: Form) {
  const [form, setForm] = useState<Form>(
    initialForm ?? {
      id: generateId(),
      title: "Formulario sin título",
      description: "",
      fields: [],
      settings: defaultSettings,
      event: defaultEvent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  )
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectedField = form.fields.find((f) => f.id === selectedFieldId) ?? null

  const updateForm = useCallback((updates: Partial<Form>) => {
    setForm((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const addField = useCallback((type: FieldType) => {
    const newField: FormField = {
      id: generateId(),
      type,
      label: "Pregunta sin título",
      validation: { required: false },
      order: form.fields.length,
    }

    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      updatedAt: new Date().toISOString(),
    }))
    setSelectedFieldId(newField.id)
  }, [form.fields.length])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const removeField = useCallback((fieldId: string) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields
        .filter((f) => f.id !== fieldId)
        .map((f, idx) => ({ ...f, order: idx })),
      updatedAt: new Date().toISOString(),
    }))
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }, [selectedFieldId])

  const duplicateField = useCallback((fieldId: string) => {
    const field = form.fields.find((f) => f.id === fieldId)
    if (!field) return

    const newField: FormField = {
      ...field,
      id: generateId(),
      label: `${field.label} (copia)`,
      order: form.fields.length,
    }

    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      updatedAt: new Date().toISOString(),
    }))
    setSelectedFieldId(newField.id)
  }, [form.fields])

  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(form.fields)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    setForm((prev) => ({
      ...prev,
      fields: result.map((f, idx) => ({ ...f, order: idx })),
      updatedAt: new Date().toISOString(),
    }))
  }, [form.fields])

  const updateSettings = useCallback((updates: Partial<FormSettings>) => {
    setForm((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const updateEvent = useCallback((updates: Partial<EventInfo>) => {
    setForm((prev) => ({
      ...prev,
      event: prev.event ? { ...prev.event, ...updates } : undefined,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  return {
    form,
    selectedField,
    selectedFieldId,
    isDragging,
    setSelectedFieldId,
    setIsDragging,
    updateForm,
    addField,
    updateField,
    removeField,
    duplicateField,
    reorderFields,
    updateSettings,
    updateEvent,
  }
}
