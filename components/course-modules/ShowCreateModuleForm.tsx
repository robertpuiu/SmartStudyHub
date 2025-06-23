"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateModuleForm from "./CreateModule";

interface ShowCreateModuleFormProps {
  courseId: string;
}

export default function ShowCreateModuleForm({
  courseId,
}: ShowCreateModuleFormProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Button onClick={() => setVisible((v) => !v)}>
        {visible ? "Cancel Module Creation" : "Create a New Module"}
      </Button>
      {visible && <CreateModuleForm courseId={courseId} />}
    </div>
  );
}
