import React, { useState } from "react";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CanvasPage = () => {
  const [steps, setSteps] = useState([1]);

  const addStep = () => {
    setSteps((prev) => [...prev, prev.length + 1]);
  };

  const handleDeleteStep = (indexToDelete) => {
    setSteps((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Automation Canvas</h1>

      {steps.map((step, index) => (
        <StepCard
          key={index}
          stepNumber={index + 1}
          onDelete={() => handleDeleteStep(index)}
        />
      ))}

      <Button
        variant="outline"
        className="flex items-center gap-2 mt-4 bg-white text-black border-gray-300"
        onClick={addStep}
      >
        <Plus className="w-4 h-4" /> Add Step
      </Button>
    </div>
  );
};

export default CanvasPage;
