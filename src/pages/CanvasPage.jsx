// src/pages/CanvasPage.jsx
import React, { useState } from "react";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// * Drag and Drop imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableStepWrapper from "@/components/SortableStepWrapper";

const API_URL = "http://localhost:5001/api/workflow";

const CanvasPage = () => {
  const [steps, setSteps] = useState([]);
  // * Zooming canvas in and out using + and -
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoomLevel(1);

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

  // * Drag and Drop handlers for steps
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);
    const reorderedSteps = arrayMove(steps, oldIndex, newIndex);
    setSteps(reorderedSteps);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={steps.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* 💡 Apply zoom only to this inner container */}
          <div
            className="flex flex-col gap-4 w-full max-w-2xl mx-auto"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            {steps.map((step, index) => (
              <SortableStepWrapper key={step.id} id={step.id}>
                <StepCard
                  step={step}
                  isFirstStep={index === 0}
                  onDelete={() => deleteStep(step.id)}
                  onUpdate={handleUpdateStep}
                />
              </SortableStepWrapper>
            ))}

            <div className="flex justify-center mt-4 mb-8">
              <Button onClick={addStep}>+ Add Step</Button>
            </div>
          </div>
        </SortableContext>
      </DndContext>

      {/* Zoom & Save/Load Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={zoomOut}>
            ➖
          </Button>
          <Button variant="outline" onClick={resetZoom}>
            🔄
          </Button>
          <Button variant="outline" onClick={zoomIn}>
            ➕
          </Button>
        </div>

        <div className="flex gap-3 mt-2">
          <Button onClick={handleLoad} variant="outline">
            ⬇ Load Workflow
          </Button>
          <Button onClick={handleSave} variant="default">
            💾 Save Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
