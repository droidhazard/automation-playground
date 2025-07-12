import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import appsDB from "../lib/database.json";

const StepCard = ({ step, isFirstStep, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedTab, setSelectedTab] = useState("input");
  const [editingName, setEditingName] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleAppSelect = (appId) => {
    onUpdate({
      ...step,
      selectedAppId: appId,
      selectedEventId: null,
      name: "", // Reset name
      fieldInputs: {},
    });
  };

  const handleEventSelect = (eventId) => {
    const selectedApp = appsDB.find((app) => app.id === step.selectedAppId);
    const events = isFirstStep ? selectedApp?.triggers : selectedApp?.actions;
    const selectedEvent = events?.find((e) => e.id === eventId);

    const autoName =
      selectedEvent && selectedApp
        ? `${selectedEvent.name} in ${selectedApp.name}`
        : "";

    onUpdate({
      ...step,
      selectedEventId: eventId,
      name: autoName,
    });
  };

  const handleFieldChange = (key, value) => {
    onUpdate({
      ...step,
      fieldInputs: {
        ...step.fieldInputs,
        [key]: value,
      },
    });
  };

  const handleNameChange = (e) => {
    onUpdate({
      ...step,
      name: e.target.value,
    });
  };

  const selectedApp = appsDB.find((app) => app.id === step.selectedAppId);
  const events = selectedApp
    ? isFirstStep
      ? selectedApp.triggers
      : selectedApp.actions
    : [];

  const selectedEvent = events?.find((e) => e.id === step.selectedEventId);
  const fields = isFirstStep
    ? selectedEvent?.outputFields || []
    : selectedEvent?.inputFields || [];

  return (
    <Card className="w-full max-w-2xl shadow mb-4">
      <CardHeader
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2 w-full">
          {expanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          {editingName ? (
            <Input
              value={step.name || ""}
              onChange={handleNameChange}
              onBlur={() => setEditingName(false)}
              autoFocus
              className="max-w-xs"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <CardTitle
              className="text-lg font-semibold flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {step.name || "Step"}
              <Pencil
                className="w-4 h-4 text-muted-foreground cursor-pointer"
                onClick={() => setEditingName(true)}
              />
            </CardTitle>
          )}
        </div>

        <div className="flex gap-3 items-center mt-3 sm:mt-0">
          <Select
            value={step.selectedAppId || undefined}
            onValueChange={handleAppSelect}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select App" />
            </SelectTrigger>
            <SelectContent>
              {appsDB.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!isFirstStep && (
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {selectedApp && (
            <Select
              value={step.selectedEventId || undefined}
              onValueChange={handleEventSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`Select ${isFirstStep ? "Trigger" : "Action"}`}
                />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedEvent && (
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
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium">
                        {field.label}
                      </label>
                      <Input
                        placeholder={`Enter ${field.label}`}
                        value={step.fieldInputs?.[field.key] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="output">
                <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded">
                  {JSON.stringify(selectedEvent.sampleOutput || {}, null, 2)}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <Button variant="outline" className="w-full">
            Run Test
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default StepCard;
