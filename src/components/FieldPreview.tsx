import { Field } from "./FormBuilder";

type FieldPreviewProps = {
  field: Field;
};

const FieldPreview = ({ field }: FieldPreviewProps) => {
  return (
    <div className="p-3 bg-white rounded-md shadow-xl flex justify-between items-center">
      <div className=" font-medium text-gray-700 flex-grow text-center">
        {field.label}
      </div>
      <div className="flex items-center">
        <div className="text-gray-400 font-extrabold">⋮</div>
        <div className="text-gray-400 ml-[-10px] font-extrabold">⋮</div>
      </div>
    </div>
  );
};

export default FieldPreview;
