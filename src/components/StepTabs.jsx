import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const StepTabs = () => {
  const [tab, setTab] = useState("input");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
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
          Test output will appear here after execution.
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StepTabs;
