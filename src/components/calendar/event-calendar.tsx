"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  created_by: string
  created_at: string
  profiles?: {
    name: string
  }
}

export function EventCalendar({ canCreate = false }: { canCreate?: boolean }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: new Date(),
  })
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd")
      const filtered = events.filter(event => event.date === dateStr)
      setSelectedDateEvents(filtered)
    }
  }, [date, events])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:created_by (name)
        `)
        .order("date", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      toast.error("일정을 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("로그인이 필요합니다.")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!profile) {
        toast.error("프로필 정보를 찾을 수 없습니다.")
        return
      }

      const { error } = await supabase.from("events").insert({
        title: eventForm.title,
        description: eventForm.description || null,
        date: format(eventForm.date, "yyyy-MM-dd"),
        created_by: profile.id,
      })

      if (error) throw error

      toast.success("일정이 추가되었습니다.")
      setIsDialogOpen(false)
      setEventForm({ title: "", description: "", date: new Date() })
      fetchEvents()
    } catch (error) {
      toast.error("일정 추가에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const eventDates = events.map(event => new Date(event.date))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>동아리 일정</CardTitle>
            <CardDescription>
              모임 및 행사 일정을 확인하세요
            </CardDescription>
          </div>
          {canCreate && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  일정 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 일정 추가</DialogTitle>
                  <DialogDescription>
                    동아리 일정을 추가해주세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">일정 제목</Label>
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="정기 모임"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">설명</Label>
                    <Textarea
                      id="description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="일정에 대한 설명을 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>날짜</Label>
                    <Calendar
                      mode="single"
                      selected={eventForm.date}
                      onSelect={(date) => date && setEventForm({ ...eventForm, date })}
                      locale={ko}
                      className="rounded-md border"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        추가 중...
                      </>
                    ) : (
                      "일정 추가"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={ko}
          className="rounded-md border"
          modifiers={{
            event: eventDates,
          }}
          modifiersStyles={{
            event: {
              fontWeight: "bold",
              textDecoration: "underline",
            },
          }}
        />
        
        {date && (
          <div className="space-y-2">
            <h3 className="font-semibold">
              {format(date, "yyyy년 MM월 dd일", { locale: ko })}
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        {event.description && (
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {event.profiles?.name || "관리자"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                이 날짜에는 일정이 없습니다.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}