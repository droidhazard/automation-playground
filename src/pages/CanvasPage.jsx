// src/pages/CanvasPage.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const StepCard = ({ stepNumber }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedTab, setSelectedTab] = useState("input");

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
          )}
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
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-2">
              <TabsTrigger value="input">Input Fields</TabsTrigger>
              <TabsTrigger value="output">Test Output</TabsTrigger>
            </TabsList>

            <TabsContent value="input">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Field 1</label>
                <Input placeholder="Map or enter value" />

                <label className="block text-sm font-medium">Field 2</label>
                <Input placeholder="Map or enter value" />
              </div>
            </TabsContent>

            <TabsContent value="output">
              <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded">
                {/* Replace with real test result */}
                Test output will appear here after execution.
              </div>
            </TabsContent>
          </Tabs>

          <Button
            variant
            className="w-full bg-white text-black border-gray-300"
          >
            Run Test
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

const CanvasPage = () => {
  const [steps, setSteps] = useState([1]);

  const addStep = () => {
    setSteps((prev) => [...prev, prev.length + 1]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Automation Canvas</h1>

      {/* Render Steps */}
      {steps.map((step, index) => (
        <StepCard key={index} stepNumber={index + 1} />
      ))}

      {/* Add Step Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 mt-4"
        onClick={addStep}
      >
        <Plus className="w-4 h-4" /> Add Step
      </Button>
    </div>
  );
};

export default CanvasPage;
