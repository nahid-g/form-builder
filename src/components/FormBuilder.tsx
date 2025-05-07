import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import FieldsPanel from "./FieldsPanel";
import FormCanvas from "./FormCanvas";
import PropertiesPanel from "./PropertiesPanel";
import { v4 as uuidv4 } from "uuid";
import FieldPreview from "./FieldPreview";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/use-toast";
import FormPreview from "./FormPreview";

export type FieldOption = {
  id: string;
  label: string;
  value: string | number;
};

export type FieldType =
  | "text"
  | "number"
  | "combobox"
  | "numberCombobox"
  | "radio"
  | "checkbox"
  | "datepicker"
  | "label"
  | "textarea";

export type Field = {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  fieldsetId: string;
  minValue?: number;
  maxValue?: number;
  options?: FieldOption[];
  defaultValue?: string | string[] | number | Date | null;
};

export type Fieldset = {
  id: string;
  name: string;
  fields: Field[];
};

const FormBuilder = () => {
  const [fieldsets, setFieldsets] = useState<Fieldset[]>([]);
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedFieldset, setSelectedFieldset] = useState<Fieldset | null>(
    null
  );
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [dragOrigin, setDragOrigin] = useState<"palette" | "canvas" | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createNewField = (type: FieldType): Field => {
    const uniqueName = generateUniqueName(type);

    const newField: Field = {
      id: uuidv4(),
      type,
      label: `${capitalizeFirstLetter(type)} Field`,
      name: uniqueName,
      placeholder: undefined,
      required: false,
      fieldsetId: "",
    };

    if (type === "combobox" || type === "radio" || type === "checkbox") {
      newField.options = [
        { id: uuidv4(), label: "Option 1", value: "Option 1" },
        { id: uuidv4(), label: "Option 2", value: "Option 2" },
        { id: uuidv4(), label: "Option 3", value: "Option 3" },
      ];
    } else if (type === "numberCombobox") {
      newField.options = [
        { id: uuidv4(), label: "1", value: 1 },
        { id: uuidv4(), label: "2", value: 2 },
        { id: uuidv4(), label: "3", value: 3 },
      ];
    }

    if (type === "number") {
      newField.minValue = -Infinity;
      newField.maxValue = Infinity;
    }

    return newField;
  };

  const generateUniqueName = (type: FieldType): string => {
    const baseFieldName = type.toLowerCase();
    let counter = 1;
    let uniqueName = `${baseFieldName}${counter}`;

    const allFieldNames = fieldsets.flatMap((fieldset) =>
      fieldset.fields.map((field) => field.name)
    );

    while (allFieldNames.includes(uniqueName)) {
      counter++;
      uniqueName = `${baseFieldName}${counter}`;
    }

    return uniqueName;
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // console.log("active", active);
    if (active.data?.current?.type === "field-type") {
      setDragOrigin("palette");
      const type = active.data.current.fieldType as FieldType;
      const newField = createNewField(type);
      setActiveField(newField);
    } else {
      setDragOrigin("canvas");
      const fieldId = active.id as string;

      const fieldsetIdx = fieldsets.findIndex((fs) =>
        fs.fields.some((f) => f.id === fieldId)
      );
      if (fieldsetIdx !== -1) {
        const fieldIdx = fieldsets[fieldsetIdx].fields.findIndex(
          (f) => f.id === fieldId
        );
        setActiveField(fieldsets[fieldsetIdx].fields[fieldIdx]);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {};

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("dragEnd", over);
    if (!over) {
      setActiveField(null);
      setDragOrigin(null);
      return;
    }

    if (dragOrigin === "palette" && activeField) {
      if (over.id === "canvas") {
        const isOverFieldset = fieldsets.some(
          (fs) => fs.id === over.id.toString().replace("fieldset:", "")
        );
        if (!isOverFieldset) {
          const newFieldsetId = uuidv4();
          const newField = { ...activeField, fieldsetId: newFieldsetId };
          const newFieldset: Fieldset = {
            id: newFieldsetId,
            name: `Fieldset ${fieldsets.length + 1}`,
            fields: [newField],
          };

          setFieldsets([...fieldsets, newFieldset]);
        }
      } else if (over.id.toString().startsWith("fieldset:")) {
        const fieldsetId = over.id.toString().replace("fieldset:", "");
        const updatedFieldsets = [...fieldsets];
        const fieldsetIndex = updatedFieldsets.findIndex(
          (fs) => fs.id === fieldsetId
        );

        if (fieldsetIndex !== -1) {
          const newField = { ...activeField, fieldsetId };
          updatedFieldsets[fieldsetIndex].fields.push(newField);
          setFieldsets(updatedFieldsets);
        }
      }
    } else if (dragOrigin === "canvas" && activeField) {
      // console.log("dragOrigin canvas", dragOrigin, activeField);
      const sourceFieldsetIdx = fieldsets.findIndex((fs) =>
        fs.fields.some((f) => f.id === activeField.id)
      );

      if (sourceFieldsetIdx === -1) {
        console.log("sourceFieldsetIdx is -1");
        setActiveField(null);
        setDragOrigin(null);
        return;
      }

      const sourceFieldIdx = fieldsets[sourceFieldsetIdx].fields.findIndex(
        (f) => f.id === activeField.id
      );
      console.log("sourceFieldIdx", sourceFieldIdx);
      const updatedFieldsets = [...fieldsets];

      if (over.data.current?.type === "field") {
        console.log(over.data.current);
        const targetFieldId = over.id.toString().replace("field:", "");
        const targetFieldsetIdx = updatedFieldsets.findIndex((fs) =>
          fs.fields.some((f) => f.id === targetFieldId)
        );

        if (targetFieldsetIdx !== -1) {
          const targetFieldIdx = updatedFieldsets[
            targetFieldsetIdx
          ].fields.findIndex((f) => f.id === targetFieldId);
          console.log(
            "targetFieldIdx",
            targetFieldIdx,
            "sourceFieldIdx",
            sourceFieldIdx
          );
          if (sourceFieldsetIdx === targetFieldsetIdx) {
            console.log(
              "same fieldset",
              updatedFieldsets[sourceFieldsetIdx].fields,
              sourceFieldIdx,
              targetFieldIdx
            );
            updatedFieldsets[sourceFieldsetIdx].fields = arrayMove(
              updatedFieldsets[sourceFieldsetIdx].fields,
              sourceFieldIdx,
              targetFieldIdx
            );
          } else {
            const [movedField] = updatedFieldsets[
              sourceFieldsetIdx
            ].fields.splice(sourceFieldIdx, 1);
            movedField.fieldsetId = updatedFieldsets[targetFieldsetIdx].id;
            updatedFieldsets[targetFieldsetIdx].fields.splice(
              targetFieldIdx,
              0,
              movedField
            );

            if (updatedFieldsets[sourceFieldsetIdx].fields.length === 0) {
              updatedFieldsets.splice(sourceFieldsetIdx, 1);
            }
          }

          setFieldsets(updatedFieldsets);
        }
      } else if (over.id.toString().startsWith("fieldset:")) {
        const targetFieldsetId = over.id.toString().replace("fieldset:", "");
        const targetFieldsetIdx = updatedFieldsets.findIndex(
          (fs) => fs.id === targetFieldsetId
        );

        if (targetFieldsetIdx !== -1) {
          const [movedField] = updatedFieldsets[
            sourceFieldsetIdx
          ].fields.splice(sourceFieldIdx, 1);
          movedField.fieldsetId = targetFieldsetId;
          updatedFieldsets[targetFieldsetIdx].fields.push(movedField);

          if (updatedFieldsets[sourceFieldsetIdx].fields.length === 0) {
            updatedFieldsets.splice(sourceFieldsetIdx, 1);
          }

          setFieldsets(updatedFieldsets);
        }
      }
    }

    setActiveField(null);
    setDragOrigin(null);
  };

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setEditingField(field);

    const fieldset = fieldsets.find((fs) => fs.id === field.fieldsetId);
    setSelectedFieldset(fieldset || null);
  };

  const handleFieldsetSelect = (fieldset: Fieldset) => {
    setSelectedFieldset(fieldset);
    setSelectedField(null);
    setEditingField(null);
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFieldsets = [...fieldsets];
    const fieldsetIdx = updatedFieldsets.findIndex((fs) =>
      fs.fields.some((f) => f.id === fieldId)
    );

    if (fieldsetIdx !== -1) {
      const fieldIdx = updatedFieldsets[fieldsetIdx].fields.findIndex(
        (f) => f.id === fieldId
      );
      updatedFieldsets[fieldsetIdx].fields.splice(fieldIdx, 1);

      if (updatedFieldsets[fieldsetIdx].fields.length === 0) {
        updatedFieldsets.splice(fieldsetIdx, 1);
      }

      setFieldsets(updatedFieldsets);

      if (selectedField?.id === fieldId) {
        setSelectedField(null);
        setEditingField(null);
      }
    }
  };

  const handleFieldDuplicate = (fieldId: string) => {
    const updatedFieldsets = [...fieldsets];
    const fieldsetIdx = updatedFieldsets.findIndex((fs) =>
      fs.fields.some((f) => f.id === fieldId)
    );

    if (fieldsetIdx !== -1) {
      const fieldIdx = updatedFieldsets[fieldsetIdx].fields.findIndex(
        (f) => f.id === fieldId
      );
      const originalField = updatedFieldsets[fieldsetIdx].fields[fieldIdx];

      const baseName = originalField.name.replace(/\d+$/, "");
      const copySuffix = originalField.name.match(/copy(\d*)$/);

      let newName = "";
      if (copySuffix) {
        const copyNum = copySuffix[1] ? parseInt(copySuffix[1]) + 1 : 2;
        newName = `${baseName}copy${copyNum}`;
      } else {
        newName = `${baseName}copy`;
      }

      let counter = 1;
      let testName = newName;
      const allFieldNames = fieldsets.flatMap((fs) =>
        fs.fields.map((f) => f.name)
      );

      while (allFieldNames.includes(testName)) {
        counter++;
        testName = `${newName}${counter}`;
      }

      const duplicatedField: Field = {
        ...originalField,
        id: uuidv4(),
        name: testName,
        label: `${originalField.label} (Copy)`,
      };

      updatedFieldsets[fieldsetIdx].fields.splice(
        fieldIdx + 1,
        0,
        duplicatedField
      );
      setFieldsets(updatedFieldsets);
    }
  };

  const handleFieldUpdate = (updatedField: Field) => {
    const updatedFieldsets = [...fieldsets];
    const fieldsetIdx = updatedFieldsets.findIndex(
      (fs) => fs.id === updatedField.fieldsetId
    );

    if (fieldsetIdx !== -1) {
      const fieldIdx = updatedFieldsets[fieldsetIdx].fields.findIndex(
        (f) => f.id === updatedField.id
      );

      if (fieldIdx !== -1) {
        updatedFieldsets[fieldsetIdx].fields[fieldIdx] = updatedField;
        setFieldsets(updatedFieldsets);
        setSelectedField(updatedField);
      }
    }
  };

  const handleFieldsetUpdate = (updatedFieldset: Fieldset) => {
    const updatedFieldsets = [...fieldsets];
    const fieldsetIdx = updatedFieldsets.findIndex(
      (fs) => fs.id === updatedFieldset.id
    );

    if (fieldsetIdx !== -1) {
      updatedFieldsets[fieldsetIdx] = updatedFieldset;
      setFieldsets(updatedFieldsets);
      setSelectedFieldset(updatedFieldset);
    }
  };

  const handleFieldsetDelete = (fieldsetId: string) => {
    const updatedFieldsets = fieldsets.filter((fs) => fs.id !== fieldsetId);
    setFieldsets(updatedFieldsets);

    if (selectedFieldset?.id === fieldsetId) {
      setSelectedFieldset(null);
    }

    if (selectedField?.fieldsetId === fieldsetId) {
      setSelectedField(null);
      setEditingField(null);
    }
  };

  const handleSaveForm = async () => {
    try {
      const resp = await fetch(
        `http://team.dev.helpabode.com:54292/api/wempro/react-dev/coding-test/m.a.nahid008@gmail.com`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldsets),
        }
      );

      if (resp.ok) {
        const data = await resp.json().catch(() => null);
        if (data) {
          toast({
            title: "Success",
            description: "Form has been saved successfully.",
          });
        } else {
          toast({
            title: "Success",
            description:
              "Form has been saved successfully, but response is not JSON.",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "There was an error saving the form.",
        });
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  const fetchSavedForm = async () => {
    try {
      const resp = await fetch(
        `http://team.dev.helpabode.com:54292/api/wempro/react-dev/coding-test/m.a.nahid008@gmail.com`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        setFieldsets(data.your_respons);
      } else {
        console.error("Error fetching saved form:", resp.statusText);
      }
    } catch (error) {
      console.error("Error fetching saved form:", error);
    }
  };

  useEffect(() => {
    fetchSavedForm();
  }, []);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          <FieldsPanel />

          <FormCanvas
            fieldsets={fieldsets}
            onFieldSelect={handleFieldSelect}
            onFieldsetSelect={handleFieldsetSelect}
            onFieldDelete={handleFieldDelete}
            onFieldDuplicate={handleFieldDuplicate}
            onFieldsetDelete={handleFieldsetDelete}
            selectedField={selectedField}
            selectedFieldset={selectedFieldset}
          />

          <PropertiesPanel
            selectedField={editingField}
            selectedFieldset={selectedFieldset}
            onFieldUpdate={handleFieldUpdate}
            onFieldsetUpdate={handleFieldsetUpdate}
            onFieldDelete={handleFieldDelete}
            onFieldsetDelete={handleFieldsetDelete}
          />
        </div>

        <DragOverlay>
          {activeField && <FieldPreview field={activeField} />}
        </DragOverlay>
      </DndContext>

      <div className="fixed bottom-6 right-6 flex gap-4">
        <Button
          variant="outline"
          onClick={() => setIsPreviewOpen(true)}
          className="bg-white"
        >
          Preview Form
        </Button>
        <Button onClick={handleSaveForm}>Save Form</Button>
      </div>

      <FormPreview
        fieldsets={fieldsets}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};

export default FormBuilder;
