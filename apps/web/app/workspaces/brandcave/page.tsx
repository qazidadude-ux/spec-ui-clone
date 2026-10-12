"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Zap, ChevronDown, ChartColumn, Clock, FolderKanban, Settings,
  PanelLeftClose, Menu, ChevronLeft, ChevronRight, List, CalendarDays, ChartPie,
  Calendar, Briefcase, ChevronsUpDown, Play, LogIn, LogOut, Ellipsis, CircleDollarSign,
  Pencil, Trash2, Search, Check,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@workspace/ui/components/popover"

// ── Sidebar star decoration ─────────────────────────────────────────────────

function SideStar({ top }: { top: string | number }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      className="absolute fill-border"
      style={{ top, left: 0, transform: "translate(-50%, -50%)" }}
    >
      <path d="M8 0C8 4.5 4.5 8 0 8C4.5 8 8 11.5 8 16C8 11.5 11.5 8 16 8C11.5 8 8 4.5 8 0Z" />
    </svg>
  )
}

// ── Nav item ────────────────────────────────────────────────────────────────

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm transition-all duration-200 px-3 ${
          active
            ? "bg-muted text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" aria-hidden />
        <span className="flex-1 text-left whitespace-nowrap">{label}</span>
      </button>
    </li>
  )
}

// ── Project data ─────────────────────────────────────────────────────────────

const PROJECTS = [
  { client: "AccessSync",               name: "[UX] AccessSync Retainer" },
  { client: "Big Data Studio",          name: "[UX] Big Data Studio Retainer" },
  { client: "Brandcave",                name: "[ADMIN] Brandcave Admin" },
  { client: "CompanyMileage",           name: "[UX] CompanyMileage Ad Hoc" },
  { client: "JT Bates Group",           name: "[UX] JT Bates Group Website" },
  { client: "Mangrove",                 name: "[UX] Mangrove" },
  { client: "Radiation Detection Company", name: "[MKT] Radiation Detection Company (RDC) Ad Hoc" },
  { client: "Realwired",                name: "[UX] Realwired Retainer" },
  { client: "Sophy Love",              name: "[MKT] Sophy Love 2026 Credit" },
  { client: "Mavric",                   name: "[UX] Stay" },
  { client: "SynkedUP",                 name: "[UX] SynkedUP UX" },
  { client: "TruAsset",                 name: "[UX] TruAsset" },
]

// ── Week helpers ─────────────────────────────────────────────────────────────

const DAY_SHORTS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getMondayOf(d: Date) {
  const day = new Date(d)
  const dow = day.getDay() // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow
  day.setDate(day.getDate() + diff)
  day.setHours(0, 0, 0, 0)
  return day
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

// ── Edit Time Entry Bottom Sheet ────────────────────────────────────────────

function EditEntrySheet({
  open,
  onClose,
  entry,
  onSave,
  onRequestDelete,
}: {
  open: boolean
  onClose: () => void
  entry: TimeEntry | null
  onSave: (updated: TimeEntry) => void
  onRequestDelete: () => void
}) {
  const [project, setProject] = useState(entry?.project ?? "")
  const [projectOpen, setProjectOpen] = useState(false)
  const [projectSearch, setProjectSearch] = useState("")
  const [task, setTask] = useState(entry?.task ?? "")
  const [taskOpen, setTaskOpen] = useState(false)
  const [startTime, setStartTime] = useState(entry?.startTime ?? "")
  const [endTime, setEndTime] = useState(entry?.endTime ?? "")
  const [editNotes, setEditNotes] = useState(entry?.notes ?? "")
  const EDIT_TASKS = ["Meeting", "Product Design"]

  useEffect(() => {
    setProject(entry?.project ?? "")
    setTask(entry?.task ?? "")
    setStartTime(entry?.startTime ?? "")
    setEndTime(entry?.endTime ?? "")
    setEditNotes(entry?.notes ?? "")
  }, [entry])

  function duration() {
    if (!startTime || !endTime) return "0m"
    const [sh, sm] = startTime.split(":").map(Number)
    const [eh, em] = endTime.split(":").map(Number)
    const mins = (eh! * 60 + em!) - (sh! * 60 + sm!)
    if (mins <= 0) return "0m"
    const h = Math.floor(mins / 60), m = mins % 60
    return m ? `${h}h ${m}m` : `${h}h`
  }

  const [closing, setClosing] = useState(false)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) { setVisible(true); setClosing(false) }
    else if (visible) { setClosing(true) }
  }, [open])

  function handleAnimationEnd() {
    if (closing) { setVisible(false); setClosing(false) }
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/80" onClick={onClose} style={{ opacity: closing ? 0 : 1, transition: "opacity 0.2s linear" }} />
      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[110] mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background ${closing ? "animate-slide-down" : "animate-slide-up"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-2 h-2 w-[100px] rounded-full bg-muted" />
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Edit Time Entry</h2>
          <button onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] px-4 py-4">
          <div className="mx-auto max-w-lg space-y-4">
            {/* Project / Task */}
            <div className="space-y-1.5">
              <label className="text-sm leading-none font-medium">Project / Task</label>
              <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                <PopoverTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <span className={project ? "text-foreground" : "text-muted-foreground"}>{project || "Select a project..."}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[var(--anchor-width)] p-0 rounded-xl">
                  <div className="flex items-center border-b border-border px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                    <input
                      className="h-9 w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                    />
                  </div>
                  <div className="p-1 overflow-y-auto overscroll-contain" style={{ maxHeight: 280 }}>
                    {PROJECTS.filter((p) =>
                      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                      p.client.toLowerCase().includes(projectSearch.toLowerCase())
                    ).map((p) => {
                      const isSelected = project === p.name
                      return (
                        <div
                          key={p.name}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={0}
                          onClick={() => { setProject(p.name); setProjectOpen(false); setProjectSearch("") }}
                          onKeyDown={(e) => e.key === "Enter" && (setProject(p.name), setProjectOpen(false), setProjectSearch(""))}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <Check className={`mr-2 h-4 w-4 shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`} aria-hidden />
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-muted-foreground">{p.client}</span>
                            <span>{p.name}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>
              <Popover open={taskOpen} onOpenChange={setTaskOpen}>
                <PopoverTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <span className={task ? "text-foreground" : "text-muted-foreground"}>{task || "Select a task..."}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" aria-hidden />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[var(--anchor-width)] p-1 rounded-xl">
                  {EDIT_TASKS.map((t) => (
                    <div
                      key={t}
                      role="option"
                      aria-selected={task === t}
                      tabIndex={0}
                      onClick={() => { setTask(t); setTaskOpen(false) }}
                      onKeyDown={(e) => e.key === "Enter" && (setTask(t), setTaskOpen(false))}
                      className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <Check className={`mr-2 h-4 w-4 shrink-0 ${task === t ? "opacity-100" : "opacity-0"}`} aria-hidden />
                      <span>{t}</span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm leading-none font-medium" htmlFor="edit-note">Notes</label>
              <textarea
                id="edit-note"
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="What did you work on?"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-sm leading-none font-medium">Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <p className="text-sm text-muted-foreground">Duration: <span className="font-medium text-foreground">{duration()}</span></p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-auto flex items-center justify-end gap-2 p-4 border-t border-border">
          <button onClick={onClose} className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Cancel
          </button>
          <button onClick={() => { onClose(); onRequestDelete() }} className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors">
            Delete
          </button>
          <button
            disabled={!project}
            onClick={() => entry && onSave({ ...entry, project, task, notes: editNotes, startTime, endTime })}
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-brand text-brand-foreground hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}

// ── Filled List View ────────────────────────────────────────────────────────

function fmt12(t: string) {
  if (!t) return ""
  const [h, m] = t.split(":").map(Number)
  const ampm = h! >= 12 ? "PM" : "AM"
  const h12 = h! % 12 || 12
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
}

function diffHours(start: string, end: string) {
  if (!start || !end) return null
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  const mins = (eh! * 60 + em!) - (sh! * 60 + sm!)
  if (mins <= 0) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function FilledListView({ entries, onUpdate, onDelete }: { entries: TimeEntry[]; onUpdate: (updated: TimeEntry, index: number) => void; onDelete: (index: number) => void }) {
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null)
  const [editIndex, setEditIndex] = useState<number>(-1)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteEntry, setDeleteEntry] = useState<TimeEntry | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number>(-1)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function openEdit(entry: TimeEntry, index: number) {
    setEditEntry(entry)
    setEditIndex(index)
    setEditOpen(true)
  }

  function openDelete(entry: TimeEntry, index: number) {
    setDeleteEntry(entry)
    setDeleteIndex(index)
    setDeleteOpen(true)
  }

  return (
    <>
    <EditEntrySheet
      open={editOpen}
      onClose={() => setEditOpen(false)}
      entry={editEntry}
      onSave={(updated) => { onUpdate(updated, editIndex); setEditOpen(false) }}
      onRequestDelete={() => editEntry && openDelete(editEntry, editIndex)}
    />
    {deleteOpen && deleteEntry && (
      <>
        <div className="fixed inset-0 z-[100] bg-black/80" onClick={() => setDeleteOpen(false)} />
        <div role="dialog" aria-modal className="fixed left-1/2 top-1/2 z-[110] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 grid gap-4 border bg-background p-6 shadow-lg sm:rounded-lg animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-lg font-semibold leading-none tracking-tight">Delete Time Entry?</h2>
            <div className="text-sm text-muted-foreground space-y-3">
              <p>This will permanently delete this time entry. The time will become unbillable.</p>
              <div className="rounded-md border border-border bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-medium text-foreground">{deleteEntry.project}</p>
                    <p className="text-sm text-muted-foreground">{deleteEntry.task ?? "—"}</p>
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {fmt12(deleteEntry.startTime)} – {fmt12(deleteEntry.endTime)}
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-destructive">This action cannot be undone.</p>
            </div>
          </div>
          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button onClick={() => setDeleteOpen(false)} className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
              Cancel
            </button>
            <button onClick={() => { onDelete(deleteIndex); setDeleteOpen(false) }} className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors">
              Delete Entry
            </button>
          </div>
          {/* Close X */}
          <button onClick={() => setDeleteOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      </>
    )}
    <div className="pb-2 sm:pb-4 space-y-0">
      {entries.map((entry, i) => {
        const duration = diffHours(entry.startTime, entry.endTime)
        return (
          <div key={i}>
            {/* Clock out row */}
            {entry.endTime && (
              <div className="relative flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center w-16 sm:w-20 shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-border bg-background shrink-0">
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">{fmt12(entry.endTime)}</p>
                  <div className="w-px flex-1 bg-border mt-2" />
                </div>
                <div className="flex-1 pb-4 min-w-0">
                  <div className="flex items-stretch bg-muted/50 border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center px-3 sm:px-4 py-2 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                      <span className="text-sm font-medium text-foreground">Clocked Out</span>
                    </div>
                    <div className="w-px bg-border shrink-0" />
                    <div className="flex items-center gap-2 px-3 sm:px-4">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Ellipsis className="w-4 h-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Time entry row */}
            <div className="relative flex gap-3 sm:gap-4">
              <div className="flex flex-col items-center w-16 sm:w-20 shrink-0">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-border bg-background shrink-0">
                  <CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden />
                </div>
                <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">{fmt12(entry.startTime)}</p>
                <div className="w-px flex-1 bg-border mt-2" />
              </div>
              <div className="flex-1 pb-4 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-stretch bg-background border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate text-sm sm:text-base">{entry.project}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">SynkedUP</span>
                      </div>
                      {(entry.task || entry.notes) && (
                        <div className="flex items-center gap-0 text-xs sm:text-sm text-muted-foreground min-w-0">
                          {entry.task && <span className="shrink-0">{entry.task}</span>}
                          {entry.task && entry.notes && <span className="mx-2 text-border shrink-0">|</span>}
                          {entry.notes && <span className="truncate min-w-0">{entry.notes}</span>}
                        </div>
                      )}
                    </div>
                    {duration && (
                      <div className="text-right shrink-0">
                        <p className="font-medium text-foreground text-sm sm:text-base">{duration}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">{fmt12(entry.startTime)} - {fmt12(entry.endTime)}</p>
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block w-px bg-border shrink-0" />
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-0 border-t sm:border-t-0 border-border">
                    <button className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Play className="w-3 h-3" aria-hidden />
                      Start
                    </button>
                    <Popover>
                      <PopoverTrigger className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Ellipsis className="w-4 h-4" aria-hidden />
                      </PopoverTrigger>
                      <PopoverContent align="end" side="bottom" sideOffset={4} className="w-32 p-1 rounded-md">
                        <button onClick={() => openEdit(entry, i)} className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                          <Pencil className="w-4 h-4 shrink-0" aria-hidden />
                          Edit
                        </button>
                        <div className="-mx-1 my-1 h-px bg-muted" />
                        <button onClick={() => openDelete(entry, i)} className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent text-destructive hover:text-destructive cursor-pointer">
                          <Trash2 className="w-4 h-4 shrink-0" aria-hidden />
                          Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {/* Clock in row */}
            <div className="relative flex gap-3 sm:gap-4">
              <div className="flex flex-col items-center w-16 sm:w-20 shrink-0">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-border bg-background shrink-0">
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden />
                </div>
                <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">{fmt12(entry.startTime)}</p>
              </div>
              <div className="flex-1 pb-4 min-w-0">
                <div className="flex items-stretch bg-muted/50 border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center px-3 sm:px-4 py-2 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-sm font-medium text-foreground">Clocked In</span>
                  </div>
                  <div className="w-px bg-border shrink-0" />
                  <div className="flex items-center gap-2 px-3 sm:px-4">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Ellipsis className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
    </>
  )
}

// ── Calendar View ───────────────────────────────────────────────────────────

const HOURS = [
  "12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
  "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm",
]

function CalendarView() {
  const now = new Date()
  const pct = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100

  return (
    <div
      className="relative overflow-y-auto overflow-x-hidden bg-background border border-border rounded-lg select-none"
      style={{ height: "calc(100vh - 20rem)", minHeight: 400 }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        {/* Mobile tabs */}
        <div className="sm:hidden flex">
          <button className="flex-1 px-3 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide uppercase transition-colors text-brand border-b-2 border-brand bg-brand/5">
            <Clock className="w-3.5 h-3.5" aria-hidden />
            Time Entries
          </button>
          <button className="flex-1 px-3 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide uppercase transition-colors text-muted-foreground hover:text-foreground">
            <Calendar className="w-3.5 h-3.5" aria-hidden />
            Calendar
          </button>
        </div>
        {/* Desktop columns */}
        <div className="hidden sm:flex">
          <div className="w-14 shrink-0" />
          <div className="flex flex-1">
            <div className="flex-[50] px-3 py-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="text-xs font-semibold tracking-wide uppercase text-foreground/70">Time Entries</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-[50] px-3 py-2 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-blue-500" aria-hidden />
              <span className="text-xs font-semibold tracking-wide uppercase text-foreground/70">Google Calendar</span>
            </div>
          </div>
          <div className="w-2 shrink-0" />
        </div>
      </div>

      {/* Time grid */}
      <div className="relative" style={{ height: 1440 }}>
        {HOURS.map((label, i) => (
          <div key={label} className="absolute left-0 right-0 border-t border-border" style={{ top: i * 60 }}>
            <div className="absolute -top-2 sm:-top-2.5 left-1 sm:left-2 text-[10px] sm:text-xs text-muted-foreground bg-background px-0.5 sm:px-1">
              {label}
            </div>
            {/* Half-hour dashed line */}
            <div className="absolute left-10 sm:left-14 right-0 border-t border-dashed border-border/50" style={{ top: 30 }} />
          </div>
        ))}

        {/* Vertical divider (desktop) */}
        <div className="absolute left-14 right-2 top-0 bottom-0 pointer-events-none hidden sm:block">
          <div className="absolute top-0 bottom-0 w-px bg-border" style={{ left: "50%" }} />
        </div>

        {/* Current time indicator */}
        <div className="absolute left-8 sm:left-12 right-0 z-20 pointer-events-none" style={{ top: `${pct}%` }}>
          <div className="relative">
            <div className="absolute -left-1 sm:-left-1.5 -top-1 sm:-top-1.5 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-red-500" />
            <div className="h-0.5 bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Track Time Modal ────────────────────────────────────────────────────────

type TimeEntry = { project: string; task?: string; notes: string; startTime: string; endTime: string; mode: "project" | "solo"; date: string }

function TrackTimeModal({ open, onClose, onSubmit, date }: { open: boolean; onClose: () => void; onSubmit: (e: TimeEntry) => void; date: Date }) {
  const [mode, setMode] = useState<"project" | "solo">("project")
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("13:00")
  const [notes, setNotes] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projectSearch, setProjectSearch] = useState("")
  const [projectOpen, setProjectOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string>("Product Design")
  const [taskOpen, setTaskOpen] = useState(false)
  const TASKS = ["Meeting", "Product Design"]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ project: selectedProject ?? "SynkedUP UX", task: selectedTask, notes, startTime, endTime, mode, date: date.toDateString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-[425px] gap-4 p-6">
        <DialogTitle className="text-lg font-semibold leading-none tracking-tight">Clock in</DialogTitle>

        <form className="flex flex-col max-h-[70vh] overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4">

            {/* Google Calendar import */}
            <div className="border-b border-border pb-4">
              <button type="button" className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" aria-hidden />
                  Import from Google Calendar
                </span>
                <ChevronDown className="w-4 h-4" aria-hidden />
              </button>
            </div>

            {/* Mode selection */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setMode("project")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${mode === "project" ? "border-brand bg-brand/5" : "border-border hover:bg-muted/50"}`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${mode === "project" ? "bg-brand/10" : "bg-muted"}`}>
                  <Briefcase className={`w-5 h-5 ${mode === "project" ? "text-brand" : "text-muted-foreground"}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Clock into a project</p>
                  <p className="text-sm text-muted-foreground">Start a timer on billable work</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("solo")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${mode === "solo" ? "border-brand bg-brand/5" : "border-border hover:bg-muted/50"}`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${mode === "solo" ? "bg-brand/10" : "bg-muted"}`}>
                  <Clock className={`w-5 h-5 ${mode === "solo" ? "text-brand" : "text-muted-foreground"}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Just clock in</p>
                  <p className="text-sm text-muted-foreground">Start tracking time without a project</p>
                </div>
              </button>
            </div>

            {/* Project / Task (only for project mode) */}
            {mode === "project" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm leading-none font-medium">Project / Task</label>
                  <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(selectedProject === "[UX] SynkedUP UX" ? null : "[UX] SynkedUP UX")}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${selectedProject === "[UX] SynkedUP UX" ? "bg-brand/10 border-brand text-brand" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                      SynkedUP UX
                    </button>
                  </div>
                  <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                    <PopoverTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <span className={selectedProject ? "text-foreground" : "text-muted-foreground"}>
                        {selectedProject ?? "Select a project..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--anchor-width)] p-0 rounded-xl">
                      <div className="flex items-center border-b border-border px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                        <input
                          className="h-9 w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                          placeholder="Search projects..."
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                        />
                      </div>
                      <div className="p-1 overflow-y-auto overscroll-contain" style={{ maxHeight: 280 }}>
                        {PROJECTS.filter((p) =>
                          p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          p.client.toLowerCase().includes(projectSearch.toLowerCase())
                        ).map((p) => {
                          const isSelected = selectedProject === p.name
                          return (
                            <div
                              key={p.name}
                              role="option"
                              aria-selected={isSelected}
                              tabIndex={0}
                              onClick={() => { setSelectedProject(p.name); setProjectOpen(false); setProjectSearch("") }}
                              onKeyDown={(e) => e.key === "Enter" && (setSelectedProject(p.name), setProjectOpen(false), setProjectSearch(""))}
                              className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <Check className={`mr-2 h-4 w-4 shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`} aria-hidden />
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">{p.client}</span>
                                <span>{p.name}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover open={taskOpen} onOpenChange={setTaskOpen}>
                    <PopoverTrigger disabled={!selectedProject} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                      <span className={selectedProject ? "text-foreground" : "text-muted-foreground"}>
                        {selectedProject ? selectedTask : "Select a task..."}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" aria-hidden />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--anchor-width)] p-1 rounded-xl">
                      {TASKS.map((task) => {
                        const isSelected = selectedTask === task
                        return (
                          <div
                            key={task}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onClick={() => { setSelectedTask(task); setTaskOpen(false) }}
                            onKeyDown={(e) => e.key === "Enter" && (setSelectedTask(task), setTaskOpen(false))}
                            className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <Check className={`mr-2 h-4 w-4 shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`} aria-hidden />
                            <span>{task}</span>
                          </div>
                        )
                      })}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm leading-none font-medium" htmlFor="note">Notes (optional)</label>
                  <textarea
                    id="note"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What are you working on?"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm leading-none font-medium">Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="End time"
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground">Leave end time empty to start a running timer</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full mt-4 h-9 rounded-md text-sm font-medium bg-brand text-brand-foreground hover:bg-brand-hover transition-colors shrink-0"
          >
            <Play className="w-4 h-4" aria-hidden />
            Start timer
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function BrandcavePage() {
  const [trackTimeOpen, setTrackTimeOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<"time" | "reports" | "projects" | "settings">("time")
  const [view, setView] = useState<"list" | "calendar">("list")
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  function shiftDate(delta: number) {
    setSelectedDate((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() + delta)
      return next
    })
  }

  function formatHeaderDate(d: Date) {
    const today = new Date()
    const isToday = d.toDateString() === today.toDateString()
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" })
    const month = d.toLocaleDateString("en-US", { month: "short" })
    const day = d.getDate()
    return isToday ? `Today, ${dayName}, ${month} ${day}` : `${dayName}, ${month} ${day}`
  }

  // Derive the Mon–Sun week containing selectedDate
  const weekStart = getMondayOf(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  // Entries for the selected date only
  const dayEntries = entries.filter((e) => isSameDay(new Date(e.date ?? selectedDate), selectedDate))
  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      <TrackTimeModal open={trackTimeOpen} onClose={() => setTrackTimeOpen(false)} onSubmit={(e) => setEntries((prev) => [...prev, e])} date={selectedDate} />

      {/* ── Sidebar ── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 bg-background flex-col z-10"
        style={{ width: 240 }}
      >
        {/* Right border with animation + stars */}
        <div className="absolute right-0 top-0 bottom-0 z-10">
          <div className="absolute top-0 bottom-0 w-px overflow-hidden bg-border" style={{ left: 0 }}>
            <div className="absolute w-full h-16 bg-gradient-to-b from-transparent via-muted-foreground to-transparent animate-slide-y" />
          </div>
          <SideStar top={0} />
          <SideStar top={64} />
          <SideStar top="calc(100% - 64px)" />
          <SideStar top="100%" />
        </div>

        {/* Workspace switcher */}
        <div className="h-16 flex items-center border-b border-border px-3">
          <button className="w-full flex items-center rounded-lg hover:bg-muted/50 transition-all duration-200 text-left gap-2 px-2 py-1.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 shrink-0">
              <Zap className="h-4 w-4 text-white" aria-hidden />
            </div>
            <p className="flex-1 text-sm font-medium text-foreground truncate">Brandcave</p>
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" aria-hidden />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden px-3">
          <ul className="space-y-1">
            {/* Reports */}
            <li>
              <button
                onClick={() => setActiveNav(activeNav === "reports" ? "time" : "reports")}
                className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm transition-all duration-200 px-3 ${activeNav === "reports" ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                <ChartColumn className="w-4 h-4 shrink-0" aria-hidden />
                <span className="flex-1 text-left whitespace-nowrap">Reports</span>
                <ChevronRight className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${activeNav === "reports" ? "rotate-90" : ""}`} aria-hidden />
              </button>
              {activeNav === "reports" && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                  {[
                    { icon: ChartPie, label: "My Breakdown" },
                    { icon: Clock, label: "Billable Hours" },
                    { icon: Clock, label: "Unbillable Hours" },
                    { icon: Clock, label: "Payroll Hours" },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label}>
                      <button className="w-full flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm transition-all duration-200 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        <span className="flex-1 whitespace-nowrap text-left">{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <NavItem icon={Clock} label="Time" active={activeNav === "time"} onClick={() => setActiveNav("time")} />
            <NavItem icon={FolderKanban} label="Projects" active={activeNav === "projects"} onClick={() => setActiveNav("projects")} />
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="pb-4 px-3">
          <ul className="space-y-1">
            <NavItem icon={Settings} label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
          </ul>
        </div>

        {/* Footer logo */}
        <div className="h-16 flex items-center border-t border-border px-5">
          <button className="hover:opacity-70 transition-opacity">
            <Image alt="Brandcave" width={120} height={24} src="/brandcave-logo.png" className="h-6 w-auto max-w-[120px] object-contain" />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ paddingLeft: 240 }}>

        {/* Header */}
        <header className="h-16 bg-background flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Menu className="w-5 h-5" aria-hidden />
            </button>
            <button className="hidden lg:flex p-1 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Collapse sidebar">
              <PanelLeftClose className="w-4 h-4" aria-hidden />
            </button>
            <nav className="flex items-center gap-1 text-sm min-w-0">
              <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">Time</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-xs font-medium text-muted-foreground">SR</span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block max-w-32 truncate">Shakeel Ur Rehman</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" aria-hidden />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {activeNav !== "time" ? (
            /* Non-time nav empty state */
            <div className="flex flex-col items-center justify-center h-full py-24 px-6 text-center">
              <div className="mb-6">
                {activeNav === "reports" ? (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-muted-foreground/40">
                    <rect x="8" y="32" width="10" height="24" rx="2" fill="currentColor" />
                    <rect x="22" y="20" width="10" height="36" rx="2" fill="currentColor" />
                    <rect x="36" y="12" width="10" height="44" rx="2" fill="currentColor" />
                    <rect x="50" y="24" width="10" height="32" rx="2" fill="currentColor" />
                  </svg>
                ) : activeNav === "projects" ? (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-muted-foreground/40">
                    <rect x="6" y="20" width="52" height="36" rx="4" fill="currentColor" />
                    <path d="M6 28h52" stroke="white" strokeWidth="2" />
                    <rect x="6" y="8" width="24" height="16" rx="4" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-muted-foreground/40">
                    <circle cx="32" cy="32" r="24" fill="currentColor" />
                    <path d="M32 20v12l8 4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {activeNav === "reports" ? "Reports coming soon" : activeNav === "projects" ? "No projects yet" : "Settings"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                {activeNav === "reports"
                  ? "Your time breakdowns, billable hours, and payroll reports will appear here once you start tracking time."
                  : activeNav === "projects"
                  ? "Create your first project to start organizing your tracked time and tasks."
                  : "Workspace settings and preferences will be available here."}
              </p>
            </div>
          ) : (
          <div>
            {/* Week header */}
            <div className="border-b border-border pt-4 sm:pt-8">
              <div className="flex items-center justify-between gap-3 px-4 sm:px-8 pb-4 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => shiftDate(-1)} className="p-1.5 sm:p-2 transition-colors hover:bg-muted rounded-l-md border-r border-border">
                      <ChevronLeft className="w-4 h-4" aria-hidden />
                    </button>
                    <button onClick={() => shiftDate(1)} className="p-1.5 sm:p-2 transition-colors hover:bg-muted rounded-r-md">
                      <ChevronRight className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-semibold text-foreground">
                    <span className="sm:hidden">{selectedDate.toDateString() === new Date().toDateString() ? "Today" : selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="hidden sm:inline">{formatHeaderDate(selectedDate)}</span>
                  </h1>
                </div>
                <button onClick={() => setTrackTimeOpen(true)} className="inline-flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium bg-brand text-brand-foreground hover:bg-brand-hover transition-colors">
                  <Clock className="w-4 h-4" aria-hidden />
                  Track Time
                </button>
              </div>

              {/* Day tabs */}
              <div className="overflow-x-auto">
                <div className="flex sm:grid sm:grid-cols-9 gap-2 sm:gap-4 py-3 px-4 sm:px-8 min-w-max sm:min-w-0">
                  {weekDays.map((d) => {
                    const isActive = isSameDay(d, selectedDate)
                    const dayEntryMins = entries
                      .filter((e) => isSameDay(new Date(e.date), d))
                      .reduce((acc, e) => {
                        if (!e.startTime || !e.endTime) return acc
                        const [sh, sm2] = e.startTime.split(":").map(Number)
                        const [eh, em] = e.endTime.split(":").map(Number)
                        return acc + Math.max(0, (eh! * 60 + em!) - (sh! * 60 + sm2!))
                      }, 0)
                    const h = Math.floor(dayEntryMins / 60), m = dayEntryMins % 60
                    const hoursLabel = `${String(h).padStart(1, "0")}:${String(m).padStart(2, "0")}`
                    return (
                    <button
                      key={d.toDateString()}
                      onClick={() => setSelectedDate(new Date(d))}
                      className={`text-left transition-colors px-2 sm:px-0 min-w-[4rem] sm:min-w-0 relative ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm ${isActive ? "font-semibold" : ""}`}>{DAY_SHORTS[(d.getDay() + 6) % 7]}</p>
                        {isSameDay(d, new Date()) && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm tabular-nums ${isActive ? "font-medium" : ""}`}>{hoursLabel}</span>
                      </div>
                    </button>
                    )
                  })}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-muted-foreground">Utilized</p>
                    <p className="text-sm font-semibold text-green-600 tabular-nums whitespace-nowrap">5:00 (100%)</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-muted-foreground">Week total</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">5:00</p>
                  </div>
                </div>
              </div>

              {/* Day indicators */}
              <div className="overflow-x-auto">
                <div className="flex sm:grid sm:grid-cols-9 gap-2 sm:gap-4 px-4 sm:px-8 min-w-max sm:min-w-0">
                  {weekDays.map((d) => (
                    <div
                      key={d.toDateString()}
                      className={`h-0.5 -mt-px min-w-[4rem] sm:min-w-0 mx-2 sm:mx-0 ${isSameDay(d, selectedDate) ? "bg-brand" : ""}`}
                    />
                  ))}
                  <div className="hidden sm:block" />
                  <div className="hidden sm:block" />
                </div>
              </div>
            </div>

            {/* Time entries area */}
            <div className="px-4 sm:px-8 pt-2 sm:pt-4 pb-4 sm:pb-8 bg-muted/50 min-h-[calc(100vh-12rem)]">
              {/* View toggle */}
              <div className="mb-4 pb-3 border-b border-border">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: view toggles */}
                  <div className="flex items-center border border-border rounded-md shrink-0">
                    <button
                      onClick={() => setView("list")}
                      className={`p-1.5 sm:p-2 transition-colors rounded-l-md ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      title="List view"
                    >
                      <List className="w-4 h-4" aria-hidden />
                    </button>
                    <div className="w-px h-5 bg-border" />
                    <button
                      onClick={() => setView("calendar")}
                      className={`p-1.5 sm:p-2 transition-colors rounded-r-md ${view === "calendar" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      title="Calendar view"
                    >
                      <CalendarDays className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                  {/* Right: stats */}
                  {dayEntries.length > 0 && (() => {
                    const total = dayEntries.reduce((acc, e) => {
                      const [sh, sm] = e.startTime.split(":").map(Number)
                      const [eh, em] = e.endTime.split(":").map(Number)
                      return acc + Math.max(0, (eh! * 60 + em!) - (sh! * 60 + sm!))
                    }, 0)
                    const h = Math.floor(total / 60), m = total % 60
                    const label = m ? `${h}h ${m}m` : `${h}h`
                    const dateLabel = selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                    return (
                      <div className="flex items-center gap-3 sm:gap-5 text-sm">
                        <div className="hidden sm:block text-muted-foreground">{dateLabel}&nbsp;&nbsp;Total: <span className="font-bold text-foreground tabular-nums">{label}</span>&nbsp;&nbsp;&nbsp;Utilized: <span className="font-bold text-green-600 tabular-nums">{label} (100%)</span></div>
                        <div className="sm:hidden"><span className="text-muted-foreground">Total: </span><span className="font-bold tabular-nums">{label}</span></div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {view === "list" ? (
                dayEntries.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center text-center py-12 sm:py-24 px-4">
                    <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" aria-hidden />
                    <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No Time Logged Today</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">Start tracking your time to see your entries here</p>
                    <button onClick={() => setTrackTimeOpen(true)} className="inline-flex items-center gap-2 px-6 h-10 rounded-md text-sm font-medium bg-brand text-brand-foreground hover:bg-brand-hover transition-colors">
                      <Clock className="w-4 h-4" aria-hidden />
                      Track Time
                    </button>
                  </div>
                ) : (
                  /* Filled state */
                  <FilledListView
                    entries={dayEntries}
                    onUpdate={(updated, index) =>
                      setEntries((prev) => {
                        const globalIndex = prev.indexOf(dayEntries[index]!)
                        if (globalIndex === -1) return prev
                        const next = [...prev]
                        next[globalIndex] = updated
                        return next
                      })
                    }
                    onDelete={(index) =>
                      setEntries((prev) => prev.filter((e) => e !== dayEntries[index]))
                    }
                  />
                )
              ) : (
                /* Calendar view */
                <CalendarView />
              )}
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  )
}
