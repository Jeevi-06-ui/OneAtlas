"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommandPaletteProps {
  commands: Array<{
    id: string;
    label: string;
    description: string;
    onSelect: () => void;
  }>;
}

export function CommandPalette({ commands }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = commands.filter((command) => {
    const haystack = `${command.label} ${command.description}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search aria-hidden="true" />
          Command
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>Search builder actions and runtime controls.</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search actions"
          aria-label="Search commands"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="grid gap-1">
          {filtered.map((command) => (
            <button
              key={command.id}
              type="button"
              className="rounded-md px-3 py-2 text-left text-sm outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                command.onSelect();
                setOpen(false);
                setQuery("");
              }}
            >
              <span className="block font-medium">{command.label}</span>
              <span className="block text-xs text-muted-foreground">{command.description}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
