import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import StepTabs from "./StepTabs";
import apps from "../database"; // path to your apps JSON file

const StepCard = ({ stepNumber, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleAppChange = (appId) => {
    const foundApp = apps.find((app) => app.id === appId);
    setSelectedApp(foundApp);
  };

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
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Select onValueChange={handleAppChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select App" />
            </SelectTrigger>
            <SelectContent>
              {apps.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500"
            onClick={onDelete}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
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
