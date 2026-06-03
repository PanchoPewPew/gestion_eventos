"use client"

import type { FormField } from "@/lib/form-types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Upload } from "lucide-react"
import { useState } from "react"

interface FieldRendererProps {
  field: FormField
  value?: unknown
  onChange?: (value: unknown) => void
  error?: string
  disabled?: boolean
  preview?: boolean
}

export function FieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled = false,
  preview = false,
}: FieldRendererProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value as string) : undefined
  )

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onChange?.(newDate?.toISOString().split("T")[0])
  }

  const commonInputClasses = cn(
    "transition-colors focus-visible:border-primary",
    error && "border-destructive focus-visible:border-destructive"
  )

  switch (field.type) {
    case "short_text":
      return (
        <Input
          placeholder={field.placeholder || "Tu respuesta"}
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={commonInputClasses}
          maxLength={field.validation.maxLength}
        />
      )

    case "long_text":
      return (
        <Textarea
          placeholder={field.placeholder || "Tu respuesta"}
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(commonInputClasses, "min-h-[100px] resize-y")}
          maxLength={field.validation.maxLength}
        />
      )

    case "email":
      return (
        <Input
          type="email"
          placeholder={field.placeholder || "correo@ejemplo.com"}
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={commonInputClasses}
        />
      )

    case "phone":
      return (
        <Input
          type="tel"
          placeholder={field.placeholder || "+56 9 1234 5678"}
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={commonInputClasses}
        />
      )

    case "number":
      return (
        <Input
          type="number"
          placeholder={field.placeholder || "0"}
          value={(value as number) || ""}
          onChange={(e) => onChange?.(e.target.valueAsNumber || "")}
          disabled={disabled}
          className={commonInputClasses}
          min={field.validation.minValue}
          max={field.validation.maxValue}
        />
      )

    case "rut":
      return (
        <Input
          placeholder={field.placeholder || "12.345.678-9"}
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={commonInputClasses}
        />
      )

    case "url":
      return (
        <Input
          type="url"
          placeholder={field.placeholder || "https://ejemplo.com"}
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={commonInputClasses}
        />
      )

    case "date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                commonInputClasses
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      )

    case "single_select":
      return (
        <RadioGroup
          value={(value as string) || ""}
          onValueChange={(v) => onChange?.(v)}
          disabled={disabled}
          className="space-y-2"
        >
          {field.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <RadioGroupItem value={option.id} id={`${field.id}-${option.id}`} />
              <Label
                htmlFor={`${field.id}-${option.id}`}
                className="font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
          {(!field.options || field.options.length === 0) && preview && (
            <p className="text-sm text-muted-foreground">
              Agrega opciones en el panel de configuración
            </p>
          )}
        </RadioGroup>
      )

    case "multi_select":
      const selectedValues = (value as string[]) || []
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <Checkbox
                id={`${field.id}-${option.id}`}
                checked={selectedValues.includes(option.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange?.([...selectedValues, option.id])
                  } else {
                    onChange?.(selectedValues.filter((v) => v !== option.id))
                  }
                }}
                disabled={disabled}
              />
              <Label
                htmlFor={`${field.id}-${option.id}`}
                className="font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
          {(!field.options || field.options.length === 0) && preview && (
            <p className="text-sm text-muted-foreground">
              Agrega opciones en el panel de configuración
            </p>
          )}
        </div>
      )

    case "dropdown":
      return (
        <Select
          value={(value as string) || ""}
          onValueChange={(v) => onChange?.(v)}
          disabled={disabled}
        >
          <SelectTrigger className={commonInputClasses}>
            <SelectValue placeholder={field.placeholder || "Selecciona una opción"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "checkbox":
      return (
        <div className="flex items-center space-x-3">
          <Checkbox
            id={field.id}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => onChange?.(checked)}
            disabled={disabled}
          />
          <Label htmlFor={field.id} className="font-normal cursor-pointer">
            {field.placeholder || "Acepto los términos y condiciones"}
          </Label>
        </div>
      )

    case "file":
      return (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            "hover:border-primary/50 hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Arrastra un archivo aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-muted-foreground">
            {field.validation.allowedFileTypes?.join(", ") || "PDF, DOC, JPG, PNG"} •
            Máx. {field.validation.maxFileSize || 10}MB
          </p>
          <Input
            type="file"
            className="hidden"
            disabled={disabled}
            accept={field.validation.allowedFileTypes?.join(",")}
          />
        </div>
      )

    default:
      return (
        <Input
          placeholder="Tu respuesta"
          value={(value as string) || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={commonInputClasses}
        />
      )
  }
}
