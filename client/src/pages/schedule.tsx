import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import type { Thread } from "@shared/schema";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export default function Schedule() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const { data: threads, isLoading } = useQuery<Thread[]>({
    queryKey: ["/api/threads"],
  });

  const scheduledThreads = threads?.filter(t => t.status === "scheduled" && t.scheduledFor) || [];
  const draftThreads = threads?.filter(t => t.status === "draft") || [];

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getThreadsForSlot = (day: Date, time: string) => {
    return scheduledThreads.filter(thread => {
      if (!thread.scheduledFor) return false;
      const scheduledDate = new Date(thread.scheduledFor);
      const [hours] = time.split(":");
      return isSameDay(scheduledDate, day) && scheduledDate.getHours() === parseInt(hours);
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setWeekStart(prev => addDays(prev, direction === "next" ? 7 : -7));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Plan and manage your posting schedule
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")} data-testid="button-prev-week">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateWeek("next")} data-testid="button-next-week">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <Skeleton className="h-[600px] w-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="w-20 p-2 border-b text-left text-xs font-medium text-muted-foreground">Time</th>
                          {weekDays.map((day, i) => (
                            <th key={i} className="p-2 border-b border-l text-center">
                              <div className="text-xs font-medium text-muted-foreground">{format(day, "EEE")}</div>
                              <div className={`text-lg font-semibold ${isSameDay(day, new Date()) ? "text-primary" : ""}`}>
                                {format(day, "d")}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time, timeIndex) => (
                          <tr key={time}>
                            <td className="p-2 border-b text-xs text-muted-foreground">{time}</td>
                            {weekDays.map((day, dayIndex) => {
                              const slotThreads = getThreadsForSlot(day, time);
                              return (
                                <td
                                  key={dayIndex}
                                  className="p-1 border-b border-l h-16 align-top hover-elevate cursor-pointer"
                                  data-testid={`slot-${format(day, "yyyy-MM-dd")}-${time}`}
                                >
                                  {slotThreads.map(thread => (
                                    <div
                                      key={thread.id}
                                      className="bg-primary/10 text-primary text-xs p-1 rounded truncate mb-1"
                                      title={thread.topic}
                                    >
                                      {thread.topic.slice(0, 20)}...
                                    </div>
                                  ))}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Queue Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Scheduled
                </CardTitle>
                <CardDescription>
                  {scheduledThreads.length} thread{scheduledThreads.length !== 1 ? "s" : ""} queued
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledThreads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No scheduled threads
                  </p>
                ) : (
                  scheduledThreads.slice(0, 5).map(thread => (
                    <div key={thread.id} className="p-2 rounded-md border text-sm">
                      <p className="font-medium truncate">{thread.topic}</p>
                      {thread.scheduledFor && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(thread.scheduledFor), "MMM d, h:mm a")}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Drafts
                </CardTitle>
                <CardDescription>
                  {draftThreads.length} draft{draftThreads.length !== 1 ? "s" : ""} ready to schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {draftThreads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No drafts available
                  </p>
                ) : (
                  draftThreads.slice(0, 5).map(thread => (
                    <div key={thread.id} className="p-2 rounded-md border text-sm hover-elevate cursor-grab">
                      <p className="font-medium truncate">{thread.topic}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{thread.hookType}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
