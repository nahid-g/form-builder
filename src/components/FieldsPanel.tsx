
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "./FormBuilder";
import { RectangleHorizontal, Calendar, Circle, Type } from "lucide-react";
import { MdLabel } from "react-icons/md";
import { RiDropdownList, RiCheckboxBlankLine } from "react-icons/ri";



const FieldsPanel = () => {
  const fieldTypes: { type: FieldType; icon: React.ReactNode; label: string }[] = [
    { type: "text", icon: <RectangleHorizontal className="h-5 w-5" />, label: "Text Field" },
    { type: "number", icon: <RectangleHorizontal className="h-5 w-5" />, label: "Number Input" },
    { type: "numberCombobox", icon: <RiDropdownList className="h-5 w-5" />, label: "Number Combo Box" },
    { type: "combobox", icon: <RiDropdownList className="h-5 w-5" />, label: "Combo Box / Dropdown" },
    { type: "radio", icon: <Circle className="h-5 w-5" />, label: "Radio Button" },
    { type: "checkbox", icon: <RiCheckboxBlankLine className="h-5 w-5" />, label: "Checkbox" },
    { type: "datepicker", icon: <Calendar className="h-5 w-5" />, label: "Datepicker" },
    { type: "label", icon: <MdLabel className="h-5 w-5" />, label: "Label" },
    { type: "textarea", icon: <Type className="h-5 w-5" />, label: "Text Area" },
  ];

  return (
    <div className="col-span-3  p-6 ">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Custom Field</h2>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableFieldType key={field.type} type={field.type} icon={field.icon} label={field.label} />
        ))}
      </div>
    </div>
  );
};

const DraggableFieldType = ({ type, icon, label }: { type: FieldType; icon: React.ReactNode; label: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type,
    data: {
      type: "field-type",
      fieldType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-between p-4 rounded-lg cursor-grab border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-600">{icon}</div>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <div className="flex items-center ">
        <div className="text-gray-400 font-extrabold">⋮</div>
        <div className="text-gray-400 ml-[-10px] font-extrabold">⋮</div>
      </div>
    </div>
  );
};

export default FieldsPanel;
