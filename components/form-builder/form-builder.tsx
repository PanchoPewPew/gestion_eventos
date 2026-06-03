"use client"

import { useFormBuilder } from "@/hooks/use-form-builder"
import { FormFieldCard } from "./form-field-card"
import { FieldTypeSelector } from "./field-type-selector"
import { FieldSettingsPanel } from "./field-settings-panel"
import { FormSettingsPanel } from "./form-settings-panel"
import { FormPreview } from "./form-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Eye,
  Pencil,
  Settings,
  FileText,
  Save,
  Share2,
  MoreHorizontal,
  Link,
  Copy,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import type { FormField } from "@/lib/form-types"

interface SortableFieldProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormField>) => void
  onDuplicate: () => void
  onRemove: () => void
}

function SortableField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDuplicate,
  onRemove,
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FormFieldCard
        field={field}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  )
}

export function FormBuilder() {
  const {
    form,
    selectedField,
    selectedFieldId,
    setSelectedFieldId,
    updateForm,
    addField,
    updateField,
    removeField,
    duplicateField,
    reorderFields,
    updateSettings,
    updateEvent,
  } = useFormBuilder()

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [rightPanel, setRightPanel] = useState<"field" | "settings">("settings")
  const [copied, setCopied] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id)
      const newIndex = form.fields.findIndex((f) => f.id === over.id)
      reorderFields(oldIndex, newIndex)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requiredFieldsCount = form.fields.filter(
    (f) => f.validation.required
  ).length

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top navbar */}
      <header className="border-b bg-card px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">EventForms</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <Input
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            className="border-0 text-lg font-medium focus-visible:ring-0 w-64 px-2 hover:bg-muted/50 transition-colors"
            placeholder="Formulario sin título"
          />
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
          >
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="edit" className="gap-2">
                <Pencil className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Vista previa
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Link className="h-4 w-4 mr-2" />
                Copiar enlace
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar formulario
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Exportar respuestas (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Exportar respuestas (Excel)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "edit" ? (
          <>
            {/* Editor area */}
            <div className="flex-1 overflow-auto p-6 bg-muted/30">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Form header card */}
                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="bg-primary h-2" />
                  <div
                    className={cn(
                      "p-6 border-l-4 transition-colors cursor-pointer",
                      selectedFieldId === null
                        ? "border-primary"
                        : "border-transparent hover:border-primary/30"
                    )}
                    onClick={() => setSelectedFieldId(null)}
                  >
                    <Input
                      value={form.title}
                      onChange={(e) => updateForm({ title: e.target.value })}
                      className="text-2xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary mb-2"
                      placeholder="Título del formulario"
                    />
                    <Textarea
                      value={form.description || ""}
                      onChange={(e) => updateForm({ description: e.target.value })}
                      className="border-0 border-b rounded-none px-0 min-h-[60px] resize-none focus-visible:ring-0 focus-visible:border-primary text-muted-foreground"
                      placeholder="Descripción del formulario (opcional)"
                    />
                    
                    {/* Form stats */}
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                      <Badge variant="secondary">
                        {form.fields.length} pregunta{form.fields.length !== 1 && "s"}
                      </Badge>
                      <Badge variant="secondary">
                        {requiredFieldsCount} obligatoria{requiredFieldsCount !== 1 && "s"}
                      </Badge>
                      {form.event && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          {form.event.capacity - form.event.registeredCount} cupos
                          disponibles
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sortable fields */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={form.fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {form.fields.map((field) => (
                        <SortableField
                          key={field.id}
                          field={field}
                          isSelected={selectedFieldId === field.id}
                          onSelect={() => {
                            setSelectedFieldId(field.id)
                            setRightPanel("field")
                          }}
                          onUpdate={(updates) => updateField(field.id, updates)}
                          onDuplicate={() => duplicateField(field.id)}
                          onRemove={() => removeField(field.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Add field button */}
                <div className="flex justify-center pt-4">
                  <FieldTypeSelector onSelect={addField} />
                </div>

                {form.fields.length === 0 && (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">
                      Comienza a crear tu formulario
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Agrega preguntas para recopilar información de los
                      participantes. Puedes elegir entre diferentes tipos de
                      campos.
                    </p>
                    <FieldTypeSelector onSelect={addField} />
                  </div>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="w-80 shrink-0 border-l bg-card flex flex-col">
              {/* Panel tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setRightPanel("field")}
                  className={cn(
                    "flex-1 py-3 text-sm font-medium transition-colors",
                    rightPanel === "field"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  disabled={!selectedField}
                >
                  Pregunta
                </button>
                <button
                  onClick={() => setRightPanel("settings")}
                  className={cn(
                    "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                    rightPanel === "settings"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </button>
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-hidden">
                {rightPanel === "field" && selectedField ? (
                  <FieldSettingsPanel
                    field={selectedField}
                    onUpdate={(updates) =>
                      updateField(selectedFieldId!, updates)
                    }
                    onRemove={() => removeField(selectedFieldId!)}
                    onClose={() => {
                      setSelectedFieldId(null)
                      setRightPanel("settings")
                    }}
                  />
                ) : (
                  <FormSettingsPanel
                    settings={form.settings}
                    event={form.event}
                    onUpdateSettings={updateSettings}
                    onUpdateEvent={updateEvent}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          /* Preview tab */
          <div className="flex-1 overflow-auto p-6 bg-muted/30">
            <FormPreview form={form} />
          </div>
        )}
      </div>
    </div>
  )
}
