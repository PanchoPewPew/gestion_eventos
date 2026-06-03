"use client"

import type { Form } from "@/lib/form-types"
import { FieldRenderer } from "./field-renderer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  Laptop,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FormPreviewProps {
  form: Form
}

const modalityIcons = {
  presencial: <Building className="h-4 w-4" />,
  online: <Globe className="h-4 w-4" />,
  hibrido: <Laptop className="h-4 w-4" />,
}

const modalityLabels = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
}

export function FormPreview({ form }: FormPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const event = form.event
  const capacityPercentage = event
    ? Math.min((event.registeredCount / event.capacity) * 100, 100)
    : 0
  const availableSpots = event ? event.capacity - event.registeredCount : 0
  const isCapacityFull = event ? event.registeredCount >= event.capacity : false

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const newErrors: Record<string, string> = {}
    form.fields.forEach((field) => {
      if (field.validation.required) {
        const value = answers[field.id]
        if (value === undefined || value === "" || value === null) {
          newErrors[field.id] = "Este campo es obligatorio"
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-primary-foreground">
            <h1 className="text-2xl font-semibold">{form.title}</h1>
          </div>

          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Inscripción enviada</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {form.settings.confirmationMessage}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSubmitted(false)
                setAnswers({})
                setErrors({})
              }}
            >
              Enviar otra respuesta
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form header */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="bg-primary h-2" />
          <div className="p-6 border-l-4 border-primary">
            <h1 className="text-2xl font-semibold mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-muted-foreground">{form.description}</p>
            )}

            {/* Event info */}
            {event && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {modalityIcons[event.modality]}
                    <span>{modalityLabels[event.modality]}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Capacity indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {event.registeredCount} / {event.capacity} inscritos
                      </span>
                    </div>
                    {availableSpots > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {availableSpots} cupos disponibles
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        Cupo completo
                      </Badge>
                    )}
                  </div>
                  <Progress value={capacityPercentage} className="h-2" />
                </div>

                {isCapacityFull && !form.settings.allowWaitlist && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Inscripciones cerradas
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {form.settings.capacityFullMessage}
                      </p>
                    </div>
                  </div>
                )}

                {isCapacityFull && form.settings.allowWaitlist && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Cupo completo - Lista de espera
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Puedes inscribirte en la lista de espera. Te
                        contactaremos si se libera un cupo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-destructive mt-4">
              * Indica un campo obligatorio
            </p>
          </div>
        </div>

        {/* Form fields */}
        {form.fields.map((field) => (
          <div key={field.id} className="bg-card border rounded-lg p-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium flex items-center gap-1">
                  {field.label}
                  {field.validation.required && (
                    <span className="text-destructive">*</span>
                  )}
                </h3>
                {field.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {field.description}
                  </p>
                )}
              </div>

              <FieldRenderer
                field={field}
                value={answers[field.id]}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [field.id]: value }))
                }
                error={errors[field.id]}
                disabled={isCapacityFull && !form.settings.allowWaitlist}
              />

              {errors[field.id] && (
                <p className="text-sm text-destructive">{errors[field.id]}</p>
              )}
            </div>
          </div>
        ))}

        {/* Submit button */}
        {form.fields.length > 0 && (
          <div className="flex justify-between items-center">
            <Button
              type="submit"
              size="lg"
              disabled={isCapacityFull && !form.settings.allowWaitlist}
              className={cn(
                isCapacityFull && form.settings.allowWaitlist && "bg-amber-600 hover:bg-amber-700"
              )}
            >
              {isCapacityFull && form.settings.allowWaitlist
                ? "Unirse a lista de espera"
                : "Enviar inscripción"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setAnswers({})
                setErrors({})
              }}
            >
              Limpiar formulario
            </Button>
          </div>
        )}

        {form.fields.length === 0 && (
          <div className="bg-card border border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Este formulario no tiene preguntas aún.
              <br />
              Agrega preguntas desde el editor para comenzar.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
