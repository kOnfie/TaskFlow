"use client";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import ProfileDropdown from "./components/profile-dropdown";
import { TaskForm } from "../task-form";
import { useCreateTask } from "@/hooks/use-create-task";

interface HeaderProps {
  title: string;
  showAddButton?: boolean;
}

export function Header({ title, showAddButton = true }: HeaderProps) {
  const { createTask } = useCreateTask();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {showAddButton && (
            <TaskForm
              onSubmit={createTask}
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              }
            />
          )}

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
