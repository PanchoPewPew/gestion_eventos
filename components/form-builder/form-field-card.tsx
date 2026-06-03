"use client"

import type { FormField, FieldOption } from "@/lib/form-types"
import { FIELD_TYPE_LABELS } from "@/lib/form-types"
import { FieldTypeIcon } from "./field-type-selector"
import { FieldRenderer } from "./field-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  GripVertical,
  Copy,
  Trash2,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FormFieldCardProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormField>) => void
  onDuplicate: () => void
  onRemove: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
}

export function FormFieldCard({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDuplicate,
  onRemove,
  dragHandleProps,
  isDragging,
}: FormFieldCardProps) {
  const hasOptions = ["single_select", "multi_select", "dropdown"].includes(field.type)

  const addOption = () => {
    const newOption: FieldOption = {
      id: Math.random().toString(36).substring(2, 11),
      label: `Opción ${(field.options?.length || 0) + 1}`,
    }
    onUpdate({
      options: [...(field.options || []), newOption],
    })
  }

  const updateOption = (optionId: string, label: string) => {
    onUpdate({
      options: field.options?.map((o) =>
        o.id === optionId ? { ...o, label } : o
      ),
    })
  }

  const removeOption = (optionId: string) => {
    onUpdate({
      options: field.options?.filter((o) => o.id !== optionId),
    })
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative bg-card border rounded-lg transition-all cursor-pointer",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-sm"
          : "border-border hover:border-primary/30",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      {/* Drag handle and actions bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted transition-colors"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FieldTypeIcon type={field.type} className="text-primary" />
            <span>{FIELD_TYPE_LABELS[field.type]}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onRemove}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Field content */}
      <div className="p-4 space-y-4">
        {/* Label editing */}
        {isSelected ? (
          <div className="space-y-2">
            <Input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Título de la pregunta"
              className="text-base font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
            />
            <Textarea
              value={field.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Descripción (opcional)"
              className="text-sm text-muted-foreground border-0 border-b rounded-none px-0 min-h-[60px] resize-none focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
        ) : (
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
        )}

        {/* Options for select fields */}
        {hasOptions && isSelected && (
          <div className="space-y-2 pl-0">
            {field.options?.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Opción ${index + 1}`}
                  className="flex-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(option.id)
                  }}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                addOption()
              }}
              className="text-primary hover:text-primary"
            >
              + Agregar opción
            </Button>
          </div>
        )}

        {/* Field preview (when not selected or for non-select fields) */}
        {!isSelected && (
          <div className="pointer-events-none">
            <FieldRenderer field={field} preview disabled />
          </div>
        )}

        {/* Options preview for select fields when selected */}
        {hasOptions && !isSelected && (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
