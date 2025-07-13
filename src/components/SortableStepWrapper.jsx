// src/components/SortableStepWrapper.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SortableStepWrapper = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-white rounded-md w-full"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-[-28px] top-4 text-gray-400 hover:text-black cursor-grab"
      >
        <GripVertical size={18} />
      </div>
      {children}
    </div>
  );
};

export default SortableStepWrapper;
