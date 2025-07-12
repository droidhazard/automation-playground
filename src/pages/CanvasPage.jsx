// src/pages/CanvasPage.jsx
import React, { useState } from "react";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const API_URL = "http://localhost:5001/api/workflow";

const CanvasPage = () => {
  const [steps, setSteps] = useState([]);

  const addStep = () => {
    const newStep = {
      id: uuidv4(),
      selectedAppId: null,
      selectedEventId: null,
      fieldInputs: {},
      name: "", // required now
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const deleteStep = (stepId) => {
    setSteps((prev) => prev.filter((step) => step.id !== stepId));
  };

  const handleUpdateStep = (updatedStep) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === updatedStep.id ? updatedStep : step))
    );
  };

  const handleLoad = async () => {
    try {
      const res = await axios.get(API_URL);
      setSteps(res.data);
    } catch (err) {
      console.error("Error loading workflow:", err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(API_URL, steps);
      alert("Workflow saved to file ✅");
    } catch (err) {
      console.error("Error saving workflow:", err);
      alert("Failed to save workflow ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {steps.map((step, index) => (
        <StepCard
          key={step.id}
          step={step}
          isFirstStep={index === 0}
          onDelete={() => deleteStep(step.id)}
          onUpdate={handleUpdateStep}
        />
      ))}

      <Button onClick={addStep} className="mt-4 mb-8">
        + Add Step
      </Button>

      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button onClick={handleLoad} variant="outline">
          ⬇ Load Workflow
        </Button>
        <Button onClick={handleSave} variant="default">
          💾 Save Workflow
        </Button>
      </div>
    </div>
  );
};

export default CanvasPage;
