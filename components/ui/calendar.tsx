import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // підключи стилі!
import { cn } from "@/lib/utils"; // твоя утиліта для класів
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-3 rounded-md", className)}
      showOutsideDays
      {...props}
      components={{
        Chevron: (props) =>
          props.orientation === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
}

export { Calendar };
