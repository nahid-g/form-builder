import React, { useState, useEffect } from "react";
import { Field, Fieldset, FieldOption, FieldType } from "./FormBuilder";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type PropertiesPanelProps = {
  selectedField: Field | null;
  selectedFieldset: Fieldset | null;
  onFieldUpdate: (field: Field) => void;
  onFieldsetUpdate: (fieldset: Fieldset) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldsetDelete: (fieldsetId: string) => void;
};

type FieldProperties = {
  id: string;
  fieldsetId: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  minValue?: number;
  maxValue?: number;
  options?: FieldOption[];
  defaultValue?: string | string[] | number | Date | null;
};

const PropertiesPanel = ({
  selectedField,
  selectedFieldset,
  onFieldUpdate,
  onFieldsetUpdate,
  onFieldDelete,
  onFieldsetDelete,
}: PropertiesPanelProps) => {
  const [fieldValues, setFieldValues] = useState<FieldProperties | null>(null);
  const [fieldsetName, setFieldsetName] = useState("");

  useEffect(() => {
    if (selectedField) {
      setFieldValues({ ...fieldValues, options: selectedField.options });
    } else {
      setFieldValues(null);
    }
  }, [selectedField]);

  useEffect(() => {
    if (selectedFieldset && !selectedFieldset.name.includes("Fieldset")) {
      setFieldsetName(selectedFieldset.name);
    } else {
      setFieldsetName("");
    }
  }, [selectedFieldset]);

  const handleFieldValueChange = (
    key: keyof Field,
    value: string | boolean | FieldOption[] | undefined
  ) => {
    setFieldValues({ ...fieldValues, [key]: value });
  };

  const handleOptionChange = (
    optionId: string,
    key: keyof FieldOption,
    value: string
  ) => {
    if (fieldValues && fieldValues.options) {
      const updatedOptions = fieldValues.options.map((option) =>
        option.id === optionId ? { ...option, [key]: value } : option
      );
      handleFieldValueChange("options", updatedOptions);
    }
  };

  const handleAddOption = () => {
    if (selectedField && selectedField.options) {

      const newOption: FieldOption = {
        id: uuidv4(),
        label: `Option ${selectedField.options.length + 1}`,
        value: `Option ${selectedField.options.length + 1}`,
      };
      handleFieldValueChange("options", [...selectedField.options, newOption]);
    }
  };

  const handleRemoveOption = (optionId: string) => {
    if (fieldValues && fieldValues.options) {
      const updatedOptions = fieldValues.options.filter(
        (option) => option.id !== optionId
      );
      handleFieldValueChange("options", updatedOptions);
    }
  };

  const handleFieldsetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFieldsetName(newName);
  };

  const handleApply = () => {
    if (selectedField && fieldValues) {
      onFieldUpdate({
        ...selectedField,
        name: fieldValues.label || selectedField.label,
        label: fieldValues.label || selectedField.label,
        placeholder: fieldValues.placeholder || selectedField.placeholder,
        required: fieldValues.required || selectedField.required,
        options: fieldValues?.options || selectedField.options,
        minValue: fieldValues.minValue || selectedField.minValue,
        maxValue: fieldValues.maxValue || selectedField.maxValue,
      });
      toast({
        title: "Success",
        description: "Field properties have been updated.",
      });
    }
    if (selectedFieldset && fieldsetName) {
      onFieldsetUpdate({ ...selectedFieldset, name: fieldsetName });
      toast({
        title: "Success",
        description: "Fieldset properties have been updated.",
      });
    }
    setFieldValues(null);
    setFieldsetName("");
  };

  const handleDelete = () => {
    if (selectedFieldset) {
      (selectedFieldset.fields.length === 1 || !selectedField) &&
        onFieldsetDelete(selectedFieldset.id);
    }
    if (selectedField) {
      onFieldDelete(selectedField.id);
    }
    toast({
      title: "Success",
      description: "Item has been deleted.",
    });
  };

  return (
    <div className="col-span-3  p-6 overflow-y-auto">
      {selectedFieldset && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Field Properties
          </h2>

          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div>
              <div className="mb-4 bg-white pb-4 border-b border-gray-200 ">
                <div className="space-y-4">
                  <div>
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      Field-set
                    </label>
                    <input
                      type="text"
                      value={fieldsetName || ""}
                      placeholder="Enter field-set name"
                      onChange={handleFieldsetNameChange}
                      className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedField && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      {selectedField.type.charAt(0).toUpperCase() +
                        selectedField.type.slice(1)}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter field name"
                      value={fieldValues?.label || ""}
                      onChange={(e) =>
                        handleFieldValueChange("label", e.target.value)
                      }
                      className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {selectedField.type === "number" && (
                    <>
                      <div>
                        <label className="block text-md font-medium text-gray-900 mb-1">
                          Min Value
                        </label>
                        <input
                          type="number"
                          placeholder="Enter min value"
                          value={fieldValues?.minValue === 0 ? "" : fieldValues?.minValue }
                          onChange={(e) =>
                            handleFieldValueChange("minValue", e.target.value)
                          }
                          className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-md font-medium text-gray-900 mb-1">
                          Max Value
                        </label>
                        <input
                          type="number"
                          placeholder="Enter max value"
                          value={fieldValues?.maxValue === 0 ? "" : fieldValues?.maxValue}
                          onChange={(e) =>
                            handleFieldValueChange("maxValue", e.target.value)
                          }
                          className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {selectedField.type !== "label" &&
                    selectedField.type !== "checkbox" &&
                    selectedField.type !== "radio" && (
                      <div>
                        <label className="block text-md font-medium text-gray-900 mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          placeholder="Enter placeholder"
                          value={fieldValues?.placeholder || ""}
                          onChange={(e) =>
                            handleFieldValueChange(
                              "placeholder",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                  {selectedField.type !== "label" && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="required"
                        checked={fieldValues?.required || false}
                        onChange={(e) =>
                          handleFieldValueChange("required", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="required"
                        className="ml-2 text-md text-gray-900"
                      >
                        Required field
                      </label>
                    </div>
                  )}

                  {(selectedField.type === "combobox" ||
                    selectedField.type === "numberCombobox" ||
                    selectedField.type === "checkbox" ||
                    selectedField.type === "radio") &&
                    selectedField.options && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-md font-medium text-gray-900">
                            Options
                          </label>
                          <button
                            type="button"
                            onClick={handleAddOption}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Option
                          </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                          {(fieldValues || selectedField).options?.map(
                            (option) => (
                              <div
                                key={option.id}
                                className="flex items-center pl-1 gap-2 bg-gray-50 rounded"
                              >
                                <input
                                  type={selectedField.type === "numberCombobox" ? "number" : "text"}
                                  value={option.label}
                                  
                                  onChange={(e) =>
                                    handleOptionChange(
                                      option.id,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter option value"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 "
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(option.id)}
                                  className="bg-gray-200 p-2 rounded-md hover:text-red-600 "
                                  disabled={selectedField.options?.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
            {(selectedField || selectedFieldset) && (
              <div className="mt-6 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button className="flex-1" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;
