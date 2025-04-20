import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Field } from "./FormBuilder";
import { Copy } from "lucide-react";
type FieldComponentProps = {
  field: Field;
  onSelect: (field: Field) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (fieldId: string) => void;
  isSelected: boolean;
};

const FieldComponent = ({
  field,
  onSelect,
  onDelete,
  onDuplicate,
  isSelected,
}: FieldComponentProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: field.id,
    data: {
      type: "field",
      field,
    },
  });

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(field);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(field.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(field.id);
  };

  if (isDragging) {
    return (
      <div
        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-md p-4 mb-2 h-16"
        id={`field:${field.id}`}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative bg-gray-100 border-2 ${
        isSelected ? "border-blue-500" : "border-gray-200"
      } rounded-md p-4 pl-2 shadow-sm hover:shadow-md transition-shadow cursor-grab`}
      onClick={handleSelect}
      id={`field:${field.id}`}
    >
      <div className="flex flex-row">
        <div className="flex items-center mr-3">
          <div className="text-gray-400 font-extrabold">⋮</div>
          <div className="text-gray-400 ml-[-10px] font-extrabold">⋮</div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-gray-800">{field.label}</div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={handleDuplicate}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="Duplicate Field"
              >
                <Copy size={16} />
              </button>
              
            </div>
          </div>

          <div className="mt-1">{renderFieldPreview(field)}</div>
        </div>
      </div>
    </div>
  );
};


const renderFieldPreview = (field: Field) => {
  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 bg-white cursor-grab"
          placeholder={field.placeholder || "Enter text"}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 bg-white cursor-grab"
          placeholder={field.placeholder || "Enter number"}
          min={field.minValue}
          max={field.maxValue}
        />
      );
    case "combobox":
    case "numberCombobox":
      return (
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 bg-white cursor-grab"
        >
          <option>{field.placeholder || "Select an option"}</option>
          {field.options?.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <div className="space-y-1 flex flex-row gap-4 ">
          {field.options?.slice(0, 2).map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300 bg-white cursor-grab"
              />
              <label className="ml-2 text-sm text-gray-600">
                {option.label}
              </label>
            </div>
          ))}
          {(field.options?.length || 0) > 2 && (
            <div className="text-xs text-gray-500">
              +{(field.options?.length || 0) - 2} more options
            </div>
          )}
        </div>
      );
    case "checkbox":
      return (
        <div className="space-y-1 flex flex-col mt-1">
          {field.options?.slice(0, 2).map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 bg-white cursor-grab"
              />
              <label className="ml-2 text-sm text-gray-600">
                {option.label}
              </label>
            </div>
          ))}
          {(field.options?.length || 0) > 2 && (
            <div className="text-xs text-gray-500">
              +{(field.options?.length || 0) - 2} more options
            </div>
          )}
        </div>
      );
    case "datepicker":
      return (
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 bg-white cursor-grab"
        />
      );
    case "textarea":
      return (
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 bg-white cursor-grab h-20 resize-none"
          placeholder={field.placeholder || "Enter text"}
        ></textarea>
      );
    default:
      return null;
  }
};

export default FieldComponent;
