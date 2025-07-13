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

const StepCard = ({ step, isFirstStep, onDelete, onUpdate, previousSteps }) => {
  const [expanded, setExpanded] = useState(false);
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
              {selectedApp?.icon && (
                <img
                  src={selectedApp.icon}
                  alt={`${selectedApp.name} icon`}
                  className="w-5 h-5 rounded-sm"
                />
              )}
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
                  {fields.map((field) => {
                    const valueObj = step.fieldInputs?.[field.key];
                    const isMapped = valueObj && typeof valueObj === "object";

                    let sourceStep = null;
                    let stepIndex = null;
                    let appIcon = null;
                    let fieldValue = "";
                    let fieldLabel = "";

                    if (isMapped) {
                      sourceStep = previousSteps.find(
                        (s) => s.id === valueObj.sourceStepId
                      );
                      stepIndex = previousSteps.findIndex(
                        (s) => s.id === valueObj.sourceStepId
                      );
                      appIcon = appsDB.find(
                        (app) => app.id === sourceStep?.selectedAppId
                      )?.icon;
                      fieldValue =
                        sourceStep?.testOutput?.[valueObj.fieldKey] || "";
                      fieldLabel =
                        sourceStep?.outputFields?.find(
                          (f) => f.key === valueObj.fieldKey
                        )?.label || valueObj.fieldKey;
                    }

                    return (
                      <div key={field.key} className="relative">
                        <label className="block text-sm font-medium mb-1">
                          {field.label}
                        </label>

                        <div className="flex items-center gap-2 relative">
                          {/* Render read-only styled view if mapped */}
                          {isMapped ? (
                            <div className="flex items-center bg-white border border-input rounded px-3 py-2 w-full text-sm shadow-sm">
                              {appIcon && (
                                <img
                                  src={appIcon}
                                  alt="icon"
                                  className="w-5 h-5 mr-2"
                                />
                              )}
                              <span className="mr-2 text-gray-500">
                                ({stepIndex + 1})
                              </span>
                              <span className="font-semibold mr-1">
                                {fieldLabel}:
                              </span>
                              <span>{fieldValue}</span>
                            </div>
                          ) : (
                            <Input
                              value={step.fieldInputs?.[field.key] || ""}
                              placeholder={`Enter ${field.label}`}
                              onChange={(e) =>
                                handleFieldChange(field.key, e.target.value)
                              }
                            />
                          )}

                          {/* Mapping Dropdown */}
                          {previousSteps?.length > 0 && (
                            <Select
                              onValueChange={(val) => {
                                const [stepId, fieldKey] = val.split("::");
                                handleFieldChange(field.key, {
                                  sourceStepId: stepId,
                                  fieldKey,
                                });
                              }}
                            >
                              <SelectTrigger className="w-10">⚙️</SelectTrigger>
                              <SelectContent>
                                {previousSteps.map((s, index) =>
                                  Object.entries(s.testOutput || {}).map(
                                    ([key, value]) => (
                                      <SelectItem
                                        key={`${s.id}-${key}`}
                                        value={`${s.id}::${key}`}
                                      >
                                        {`Step ${index + 1}.${key}: ${value}`}
                                      </SelectItem>
                                    )
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}

                          {/* Remove Mapping Button */}
                          {isMapped && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleFieldChange(field.key, "")}
                            >
                              ❌
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="output">
                <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded">
                  {JSON.stringify(selectedEvent.sampleOutput || {}, null, 2)}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              onUpdate({
                ...step,
                testOutput: selectedEvent?.sampleOutput || {},
              })
            }
          >
            Run Test
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default StepCard;
