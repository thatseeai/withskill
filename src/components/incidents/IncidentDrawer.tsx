import { useEffect, useRef, useState } from 'react'
import { X, CheckCircle2, Eye, AlertCircle, Clock, Send } from 'lucide-react'
import { Incident } from '@/types/incident'
import { SeverityBadge, StatusBadge } from '@/components/common/StatusBadge'
import { formatDate, formatRelativeTime } from '@/utils/dateFormat'
import { cn } from '@/lib/utils'

interface IncidentDrawerProps {
  incident: Incident | null
  open: boolean
  onClose: () => void
}

export function IncidentDrawer({ incident, open, onClose }: IncidentDrawerProps) {
  const [comment, setComment] = useState('')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Focus trap and ESC key handler
  useEffect(() => {
    if (!open) return

    // Focus close button on open
    setTimeout(() => closeButtonRef.current?.focus(), 100)

    // ESC key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !drawerRef.current) return

      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
    }
  }, [open, onClose])

  const handleAddComment = () => {
    if (!comment.trim()) return
    // In real app, this would add comment to incident
    console.log('Adding comment:', comment)
    setComment('')
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'detected':
        return AlertCircle
      case 'mitigated':
        return Eye
      case 'resolved':
        return CheckCircle2
      default:
        return Clock
    }
  }

  if (!incident) return null

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[600px] bg-card border-l border-border/50 z-50 overflow-y-auto transition-transform duration-300 ease-out shadow-2xl',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-start justify-between p-6">
            <div className="flex-1 pr-4">
              <h2
                id="drawer-title"
                className="text-xl font-bold tracking-tight mb-3"
              >
                {incident.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
                <span className="text-xs text-muted-foreground font-mono">
                  {incident.id}
                </span>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Details */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Details
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Service</dt>
                <dd className="text-sm font-medium">{incident.service}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Owner</dt>
                <dd className="text-sm font-medium">{incident.owner}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Started</dt>
                <dd className="text-sm font-medium">
                  {formatDate(incident.started)}
                </dd>
              </div>
              {incident.resolved && (
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Resolved</dt>
                  <dd className="text-sm font-medium">
                    {formatDate(incident.resolved)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Duration</dt>
                <dd className="text-sm font-medium font-mono">
                  {incident.duration}m
                </dd>
              </div>
            </dl>
          </section>

          {/* Timeline */}
          {incident.timeline && incident.timeline.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Timeline
              </h3>
              <div className="relative space-y-6">
                {/* Vertical line */}
                <div className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500 via-cyan-500/50 to-transparent" />

                {incident.timeline.map((event, index) => {
                  const Icon = getTimelineIcon(event.type)
                  const isLast = index === incident.timeline!.length - 1

                  return (
                    <div key={event.id} className="relative flex gap-4">
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={cn(
                            'flex items-center justify-center h-6 w-6 rounded-full ring-4 ring-background',
                            event.type === 'resolved' &&
                              'bg-green-500 text-white',
                            event.type === 'mitigated' &&
                              'bg-yellow-500 text-white',
                            event.type === 'detected' &&
                              'bg-red-500 text-white'
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        {!isLast && (
                          <div className="absolute left-3 top-6 h-full w-px bg-border" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium mb-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(event.timestamp)}</span>
                          <span>•</span>
                          <span>{event.user}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Comments */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Comments
            </h3>

            {/* Comment list */}
            {incident.comments && incident.comments.length > 0 ? (
              <div className="space-y-4 mb-4">
                {incident.comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        {c.user.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium">{c.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(c.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No comments yet</p>
            )}

            {/* Add comment form */}
            <div className="space-y-2">
              <label htmlFor="comment-input" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-muted disabled:text-muted-foreground text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                <Send className="h-4 w-4" />
                Add Comment
              </button>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 border-t border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 p-6">
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Resolve this incident"
            >
              <CheckCircle2 className="inline h-4 w-4 mr-2" />
              Resolve Incident
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              aria-label="Set incident to monitoring status"
            >
              <Eye className="inline h-4 w-4 mr-2" />
              Set to Monitoring
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
