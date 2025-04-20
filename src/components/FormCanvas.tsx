import { useDroppable } from "@dnd-kit/core";
import { Field, Fieldset } from "./FormBuilder";
import FieldsetComponent from "./FieldsetComponent";

type FormCanvasProps = {
  fieldsets: Fieldset[];
  onFieldSelect: (field: Field) => void;
  onFieldsetSelect: (fieldset: Fieldset) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldDuplicate: (fieldId: string) => void;
  onFieldsetDelete: (fieldsetId: string) => void;
  selectedField: Field | null;
  selectedFieldset: Fieldset | null;
};

const FormCanvas = ({
  fieldsets,
  onFieldSelect,
  onFieldsetSelect,
  onFieldDelete,
  onFieldDuplicate,
  onFieldsetDelete,
  selectedField,
  selectedFieldset,
}: FormCanvasProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  return (
    <div ref={setNodeRef} className={`col-span-6 p-6`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Module</h2>

      {fieldsets.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center h-[calc(100vh-300px)]  border-gray-200 rounded-lg bg-white ${
            isOver ? "border-2 border-red-400 border-dashed bg-red-100 " : ""
          }`}
        >
          <div className="text-gray-500 text-center p-10 md:p-20 xl:p-40">
            <p className="mb-2 text-lg">
              Welcome to the Form Builder! Start by adding your first module to
              create amazing forms.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`space-y-6 bg-white min-h-[calc(100vh-300px)] rounded-lg px-6 py-8 ${
            isOver ? "border-2 border-red-400 border-dashed bg-red-100 " : ""
          }`}
        >
          {fieldsets.map((fieldset, index) => (
            <FieldsetComponent
              key={fieldset?.id || index}
              fieldset={fieldset}
              onFieldSelect={onFieldSelect}
              onFieldsetSelect={onFieldsetSelect}
              onFieldDelete={onFieldDelete}
              onFieldDuplicate={onFieldDuplicate}
              onFieldsetDelete={onFieldsetDelete}
              isSelected={selectedFieldset?.id === fieldset.id}
              selectedFieldId={selectedField?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormCanvas;
