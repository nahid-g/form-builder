import React from "react";
import FormBuilder from "@/components/FormBuilder";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <div className="flex items-center gap-8">
          <img src="/wempro.png" alt="Form Builder" width={100} height={100} />
          <div className="h-20 w-px bg-gray-300" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
            <p className="text-sm text-gray-900">
              Add and customize forms for your needs
            </p>
          </div>
        </div>
      </header>
      <main className="p-6">
        <FormBuilder />
      </main>
    </div>
  );
};

export default Index;
