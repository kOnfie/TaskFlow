"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Task } from "@/types/task.types";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { useForm, Controller } from "react-hook-form";
import { Spinner } from "../ui/spinner";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "user_id">) => Promise<void>;
  trigger?: React.ReactNode;

  type?: "create" | "edit";

  initialData?: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: "work" | "personal" | "development" | "health";
    dueDate: Date | undefined;
  };
}

export function TaskForm({ onSubmit, trigger, initialData, type = "create" }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset: resetForm,
  } = useForm({
    defaultValues: {
      ...initialData,
    },
  });

  async function submitForm(formData: any) {
    setIsLoading(true);
    const { title, description, priority, category, dueDate } = formData;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: "todo",
      category,
      dueDate,
    });

    resetForm();
    setIsLoading(false);
    setOpen(false);
  }

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Add Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" placeholder="Enter task title..." {...register("title", { required: "Enter title" })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              {...register("description", { required: "Enter description" })}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>

              <Controller
                name="priority"
                control={control}
                rules={{ required: "Select priority" }}
                render={({ field }) => {
                  console.log("errors:", errors);

                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.priority ? "outline-none ring-2 ring-ring ring-offset-2" : ""}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>

              <Controller
                name="category"
                control={control}
                rules={{ required: "Select category" }}
                render={({ field }) => {
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.category ? "outline-none ring-2 ring-ring ring-offset-2" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>

            <Controller
              name="dueDate"
              control={control}
              rules={{ required: "Select due date" }}
              render={({ field }) => {
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.dueDate ? "outline-none ring-2 ring-ring ring-offset-2" : ""
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{isLoading ? <Spinner /> : type === "create" ? "Create task" : "Edit task"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
