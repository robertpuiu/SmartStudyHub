"use client";

import { useState, useMemo } from "react";
import type { LLMConversation, CognitiveFocus } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewItem from "./review-question";

interface ReviewClientProps {
  convos: (LLMConversation & {
    student: { name: string | null };
    course: { title: string };
  })[];
}

export default function ReviewClient({ convos }: ReviewClientProps) {
  const [selected, setSelected] = useState<"ALL" | CognitiveFocus>("ALL");

  // Construim lista de tab-uri
  const tags = useMemo(() => {
    const set = new Set<CognitiveFocus>(convos.map((c) => c.tag));
    return ["ALL", ...Array.from(set)] as ("ALL" | CognitiveFocus)[];
  }, [convos]);

  // Filtrăm conversațiile
  const filtered = useMemo(() => {
    return selected === "ALL"
      ? convos
      : convos.filter((c) => c.tag === selected);
  }, [selected, convos]);

  return (
    <div className="p-6 space-y-6">
      <Tabs value={selected} onValueChange={(v) => setSelected(v as any)}>
        <TabsList className="space-x-2 bg-muted p-1 rounded">
          {tags.map((tag) => {
            const label = tag === "ALL" ? "Toate" : tag.replace("_", " ");
            return (
              <TabsTrigger
                key={tag}
                value={tag}
                className="flex-1 text-sm py-1 px-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">Nicio conversație găsită.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <ReviewItem key={c.id} convo={c} />
          ))}
        </div>
      )}
    </div>
  );
}
