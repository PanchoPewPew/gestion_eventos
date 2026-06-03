"use client"

import type { FormField, FieldType, FieldValidation } from "@/lib/form-types"
import { FIELD_TYPE_LABELS } from "@/lib/form-types"
import { FieldTypeIcon } from "./field-type-selector"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, X } from "lucide-react"

interface FieldSettingsPanelProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onRemove: () => void
  onClose: () => void
}

export function FieldSettingsPanel({
  field,
  onUpdate,
  onRemove,
  onClose,
}: FieldSettingsPanelProps) {
  const updateValidation = (updates: Partial<FieldValidation>) => {
    onUpdate({
      validation: { ...field.validation, ...updates },
    })
  }

  const showLengthValidation = ["short_text", "long_text"].includes(field.type)
  const showNumberValidation = field.type === "number"
  const showSelectValidation = ["multi_select"].includes(field.type)
  const showFileValidation = field.type === "file"

  return (
    <div className="h-full flex flex-col border-l bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <FieldTypeIcon type={field.type} className="text-primary" />
          <span className="font-medium text-sm">
            {FIELD_TYPE_LABELS[field.type]}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Configuración básica
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="placeholder">Texto de ayuda</Label>
              <Input
                id="placeholder"
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Ej: Escribe tu respuesta aquí"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campo obligatorio</Label>
                <p className="text-xs text-muted-foreground">
                  El usuario debe completar este campo
                </p>
              </div>
              <Switch
                checked={field.validation.required || false}
                onCheckedChange={(checked) =>
                  updateValidation({ required: checked })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Field type */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Tipo de campo
            </h4>
            <Select
              value={field.type}
              onValueChange={(value) => onUpdate({ type: value as FieldType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][]).map(
                  ([type, label]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <FieldTypeIcon type={type} />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Validation rules based on field type */}
          {(showLengthValidation || showNumberValidation || showSelectValidation || showFileValidation) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Validaciones
                </h4>

                {showLengthValidation && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="minLength">Longitud mínima</Label>
                        <Input
                          id="minLength"
                          type="number"
                          min={0}
                          value={field.validation.minLength || ""}
                          onChange={(e) =>
                            updateValidation({
                              minLength: e.target.valueAsNumber || undefined,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxLength">Longitud máxima</Label>
                        <Input
                          id="maxLength"
                          type="number"
                          min={0}
                          value={field.validation.maxLength || ""}
                          onChange={(e) =>
                            updateValidation({
                              maxLength: e.target.valueAsNumber || undefined,
                            })
                          }
                          placeholder="Sin límite"
                        />
                      </div>
                    </div>
                  </>
                )}

                {showNumberValidation && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="minValue">Valor mínimo</Label>
                      <Input
                        id="minValue"
                        type="number"
                        value={field.validation.minValue ?? ""}
                        onChange={(e) =>
                          updateValidation({
                            minValue: e.target.valueAsNumber || undefined,
                          })
                        }
                        placeholder="Sin límite"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxValue">Valor máximo</Label>
                      <Input
                        id="maxValue"
                        type="number"
                        value={field.validation.maxValue ?? ""}
                        onChange={(e) =>
                          updateValidation({
                            maxValue: e.target.valueAsNumber || undefined,
                          })
                        }
                        placeholder="Sin límite"
                      />
                    </div>
                  </div>
                )}

                {showSelectValidation && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="minSelections">Selecciones mínimas</Label>
                      <Input
                        id="minSelections"
                        type="number"
                        min={0}
                        value={field.validation.minSelections || ""}
                        onChange={(e) =>
                          updateValidation({
                            minSelections: e.target.valueAsNumber || undefined,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSelections">Selecciones máximas</Label>
                      <Input
                        id="maxSelections"
                        type="number"
                        min={0}
                        value={field.validation.maxSelections || ""}
                        onChange={(e) =>
                          updateValidation({
                            maxSelections: e.target.valueAsNumber || undefined,
                          })
                        }
                        placeholder="Sin límite"
                      />
                    </div>
                  </div>
                )}

                {showFileValidation && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Tamaño máximo (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        min={1}
                        value={field.validation.maxFileSize || ""}
                        onChange={(e) =>
                          updateValidation({
                            maxFileSize: e.target.valueAsNumber || undefined,
                          })
                        }
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowedFileTypes">
                        Tipos de archivo permitidos
                      </Label>
                      <Input
                        id="allowedFileTypes"
                        value={field.validation.allowedFileTypes?.join(", ") || ""}
                        onChange={(e) =>
                          updateValidation({
                            allowedFileTypes: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder=".pdf, .doc, .jpg, .png"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separar con comas
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Custom pattern validation */}
          {["short_text", "phone", "rut"].includes(field.type) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Validación personalizada
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="pattern">Patrón (regex)</Label>
                  <Input
                    id="pattern"
                    value={field.validation.pattern || ""}
                    onChange={(e) => updateValidation({ pattern: e.target.value })}
                    placeholder="^[a-zA-Z]+$"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patternMessage">Mensaje de error</Label>
                  <Input
                    id="patternMessage"
                    value={field.validation.patternMessage || ""}
                    onChange={(e) =>
                      updateValidation({ patternMessage: e.target.value })
                    }
                    placeholder="El formato no es válido"
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Delete action */}
          <Button
            variant="outline"
            onClick={onRemove}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar pregunta
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
