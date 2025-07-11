import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { X } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import StepTabs from "./StepTabs";

const StepCard = ({ stepNumber, onDelete }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card className="w-full max-w-2xl shadow mb-4">
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}{" "}
          Step {stepNumber}
        </CardTitle>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select App" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sheets">Google Sheets</SelectItem>
            <SelectItem value="slack">Slack</SelectItem>
            <SelectItem value="hubspot">HubSpot</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <StepTabs />
          <Button
            variant="outline"
            className="w-full bg-white text-black border-gray-300"
          >
            Run Test
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default StepCard;
