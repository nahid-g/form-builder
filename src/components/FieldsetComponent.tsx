
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Field, Fieldset } from "./FormBuilder";
import FieldComponent from "./FieldComponent";

type FieldsetComponentProps = {
  fieldset: Fieldset;
  onFieldSelect: (field: Field) => void;
  onFieldsetSelect: (fieldset: Fieldset) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldDuplicate: (fieldId: string) => void;
  onFieldsetDelete: (fieldsetId: string) => void;
  isSelected: boolean;
  selectedFieldId: string | undefined;
};

const FieldsetComponent = ({
  fieldset,
  onFieldSelect,
  onFieldsetSelect,
  onFieldDelete,
  onFieldDuplicate,
  onFieldsetDelete,
  isSelected,
  selectedFieldId,
}: FieldsetComponentProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `fieldset:${fieldset.id}`,
  });

  const handleFieldsetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFieldsetSelect(fieldset);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFieldsetDelete(fieldset.id);
  };

  return (
    <fieldset
      ref={setNodeRef}
      className={`border-2 rounded-lg p-4 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : isOver
          ? "border-red-300 border-dashed bg-red-50 "
          : "border-gray-200 bg-white"
      } transition-colors`}
      onClick={handleFieldsetClick}
    >
      <legend className="text-md font-medium px-2 text-gray-700 border-2 rounded-md  bg-white">
        {fieldset.name}
      </legend>

      <div className="space-y-3">
        {fieldset.fields?.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 text-gray-500 text-center">
            Drop fields here
          </div>
        ) : (
          fieldset.fields?.map((field) => (
            <FieldComponent
              key={field.id}
              field={field}
              onSelect={onFieldSelect}
              onDelete={onFieldDelete}
              onDuplicate={onFieldDuplicate}
              isSelected={field.id === selectedFieldId}
            />
          ))
        )}
      </div>
    </fieldset>
  );
};

export default FieldsetComponent;
