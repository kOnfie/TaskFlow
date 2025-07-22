"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { TaskCategory } from "@/types/task.types";
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { useGetStats } from "@/hooks/use-get-stats";
import { useEffect } from "react";
import { statsStore } from "@/zustand/stats.store";

interface StatsCardsProps {
  category?: TaskCategory;
}

export function StatsCards({ category }: StatsCardsProps) {
  const { getStats } = useGetStats();

  const stats = statsStore((state) => state.stats);

  useEffect(() => {
    getStats(category);
  }, []);

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              {card.title === "Completed" && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
