import React from "react";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";

export default function EventCard({ event, onRegister, isRegistered, showAdminActions=false, onEdit, onDelete }){
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-extrabold">{event.name}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1"><CalendarDays size={16}/> {new Date(event.date).toDateString()}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={16}/> {event.location || "Campus / Online"}</span>
            <span className="inline-flex items-center gap-1"><Sparkles size={16}/> {event.type || "General"}</span>
          </div>
        </div>

        {showAdminActions ? (
          <div className="flex gap-2">
            <button onClick={() => onEdit?.(event)} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold">Edit</button>
            <button onClick={() => onDelete?.(event)} className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-sm font-semibold text-rose-100">Delete</button>
          </div>
        ) : (
          <div>
            <button
              disabled={isRegistered}
              onClick={() => onRegister?.(event)}
              className="px-4 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 font-semibold"
            >
              {isRegistered ? "Registered" : "Register"}
            </button>
          </div>
        )}
      </div>

      {event.description ? (
        <div className="mt-4 text-sm text-slate-200 whitespace-pre-wrap">{event.description}</div>
      ) : (
        <div className="mt-4 text-sm text-slate-400">No description yet.</div>
      )}

      {event.keywords?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {event.keywords.map((k, idx) => (
            <span key={idx} className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/10 text-slate-100">{k}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
