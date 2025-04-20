import { Fieldset } from "./FormBuilder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type FormPreviewProps = {
  fieldsets: Fieldset[];
  isOpen: boolean;
  onClose: () => void;
};

const FormPreview = ({ fieldsets, isOpen, onClose }: FormPreviewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Form Preview
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form className="space-y-6">
            {fieldsets.map((fieldset, index) => (
              <fieldset
                key={fieldset?.id || index}
                className="border rounded-lg px-6 py-3"
              >
                <legend className="text-lg font-semibold px-2 border rounded-md border-gray-200 p-1">
                  {fieldset.name}
                </legend>
                <div className="space-y-4">
                  {fieldset.fields?.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label
                        htmlFor={field.id}
                        className="block text-md font-medium"
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.type === "text" && (
                        <input
                          type="text"
                          id={field.id}
                          placeholder={field.placeholder}
                          className="w-full p-2 border rounded-md"
                        />
                      )}
                      {field.type === "number" && (
                        <input
                          type="number"
                          id={field.id}
                          placeholder={field.placeholder}
                          min={field.minValue}
                          max={field.maxValue}
                          className="w-full p-2 border rounded-md"
                        />
                      )}
                      {field.type === "textarea" && (
                        <textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          className="w-full p-2 border rounded-md"
                        />
                      )}
                      {(field.type === "combobox" ||
                        field.type === "numberCombobox") && (
                        <select
                          id={field.id}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option) => (
                            <option key={option.id} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {field.type === "radio" && (
                        <div className="flex flex-row gap-4">
                          {field.options?.map((option) => (
                            <div key={option.id} className="flex items-center">
                              <input
                                type="radio"
                                id={`${field.id}-${option.id}`}
                                name={field.id}
                                value={option.value}
                                className="mr-2"
                              />
                              <label htmlFor={`${field.id}-${option.id}`}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === "checkbox" && (
                        <div className="">
                          {field.options?.map((option) => (
                            <div key={option.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`${field.id}-${option.id}`}
                                name={field.id}
                                value={option.value}
                                className="mr-2"
                              />
                              <label htmlFor={`${field.id}-${option.id}`}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === "datepicker" && (
                        <input
                          type="date"
                          id={field.id}
                          className="w-full p-2 border rounded-md"
                        />
                      )}
                      {field.type === "label" && (
                        <p className="text-sm text-gray-600">{field.label}</p>
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormPreview;
