"use client"

import { FIELD_TYPE_LABELS, type FieldType } from "@/lib/form-types"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Calendar,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Paperclip,
  Square,
  Link,
  CreditCard,
  Plus,
} from "lucide-react"
import { useState } from "react"

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  short_text: <Type className="h-4 w-4" />,
  long_text: <AlignLeft className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  single_select: <CircleDot className="h-4 w-4" />,
  multi_select: <CheckSquare className="h-4 w-4" />,
  dropdown: <ChevronDown className="h-4 w-4" />,
  file: <Paperclip className="h-4 w-4" />,
  checkbox: <Square className="h-4 w-4" />,
  url: <Link className="h-4 w-4" />,
  rut: <CreditCard className="h-4 w-4" />,
}

const fieldCategories = [
  {
    name: "Texto",
    types: ["short_text", "long_text"] as FieldType[],
  },
  {
    name: "Contacto",
    types: ["email", "phone", "rut"] as FieldType[],
  },
  {
    name: "Datos",
    types: ["number", "date", "url"] as FieldType[],
  },
  {
    name: "Selección",
    types: ["single_select", "multi_select", "dropdown"] as FieldType[],
  },
  {
    name: "Otros",
    types: ["file", "checkbox"] as FieldType[],
  },
]

interface FieldTypeSelectorProps {
  onSelect: (type: FieldType) => void
}

export function FieldTypeSelector({ onSelect }: FieldTypeSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (type: FieldType) => {
    onSelect(type)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar pregunta
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <ScrollArea className="h-80">
          <div className="p-2">
            {fieldCategories.map((category) => (
              <div key={category.name} className="mb-3">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {category.name}
                </p>
                <div className="space-y-0.5">
                  {category.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSelect(type)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm hover:bg-muted transition-colors text-left"
                    >
                      <span className="text-muted-foreground">
                        {fieldTypeIcons[type]}
                      </span>
                      <span>{FIELD_TYPE_LABELS[type]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

interface FieldTypeIconProps {
  type: FieldType
  className?: string
}

export function FieldTypeIcon({ type, className }: FieldTypeIconProps) {
  const iconElement = fieldTypeIcons[type]
  if (!iconElement) return null
  return <span className={className}>{iconElement}</span>
}
