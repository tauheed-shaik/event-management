import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { clearToken, getUser } from "../lib/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Toast from "../components/Toast";
import EventCard from "../components/EventCard";
import { LogOut, Plus, Search, Sparkles, Wand2, BarChart3 } from "lucide-react";

function GlassBG(){
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute top-40 -right-24 h-[360px] w-[360px] rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  )
}

function Modal({ open, title, children, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [events, setEvents] = useState([]);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const notify = (title, message="") => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3200);
  };

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if(!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(e =>
      e.name.toLowerCase().includes(q) ||
      (e.description || "").toLowerCase().includes(q) ||
      (e.keywords || []).join(",").toLowerCase().includes(q)
    );
  }, [events, search]);

  const fetchAll = async () => {
    try{
      setLoading(true);
      const [ev, rg] = await Promise.all([
        api.get("/events"),
        api.get("/registrations/my")
      ]);
      setEvents(ev.data);
      setRegs(rg.data);
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const logout = async () => {
    try{ await api.post("/auth/logout", {}); }catch{}
    clearToken();
    window.location.href = "/login";
  };

  const isRegistered = (eventId) => regs.some(r => r.event?._id === eventId);

  const register = async (event) => {
    try{
      await api.post(`/registrations/${event._id}`, {});
      notify("Registered", "Event registration successful.");
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  // Admin modal create/edit
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    type: "Workshop",
    keywords: "",
    description: ""
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name:"", date:"", location:"", type:"Workshop", keywords:"", description:"" });
    setOpenForm(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      name: event.name,
      date: event.date?.slice(0,10),
      location: event.location || "",
      type: event.type || "Workshop",
      keywords: (event.keywords || []).join(", "),
      description: event.description || "",
    });
    setOpenForm(true);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try{
      const payload = {
        name: form.name.trim(),
        date: form.date,
        location: form.location.trim(),
        type: form.type,
        keywords: form.keywords.split(",").map(x=>x.trim()).filter(Boolean),
        description: form.description.trim(),
      };
      if(editing){
        await api.put(`/events/${editing._id}`, payload);
        notify("Updated", "Event updated.");
      }else{
        await api.post("/events", payload);
        notify("Created", "Event created.");
      }
      setOpenForm(false);
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const deleteEvent = async (event) => {
    if(!confirm("Delete this event?")) return;
    try{
      await api.delete(`/events/${event._id}`);
      notify("Deleted", "Event deleted.");
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const generateAI = async () => {
    try{
      notify("Generating...", "Groq AI is generating description");
      const res = await api.post("/ai/generate-event-description", {
        name: form.name,
        date: form.date,
        keywords: form.keywords.split(",").map(x=>x.trim()).filter(Boolean),
      });
      setForm(f => ({ ...f, description: res.data.description }));
      notify("Done", "AI description generated.");
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  // Admin analytics
  const analytics = useMemo(() => {
    const total = events.length;
    const regCount = events.reduce((acc, e) => acc + (e.registrationsCount || 0), 0);
    return { total, regCount };
  }, [events]);

  return (
    <div className="min-h-screen">
      <GlassBG />

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                <Sparkles size={16} />
                Event Management System
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
                Campus Events Portal
              </h1>
              <p className="text-slate-300 mt-2">
                Logged in as <span className="font-semibold">{user?.name}</span> ({user?.role})
              </p>
            </div>

            <div className="flex gap-2">
              {isAdmin ? <Button onClick={openCreate}><Plus size={18}/> Add Event</Button> : null}
              <Button variant="secondary" onClick={logout}><LogOut size={18}/> Logout</Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events by name/keywords..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>
            </div>
            {isAdmin ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-300" />
                <span className="text-sm text-slate-200">Events: {analytics.total} • Total Registrations: {analytics.regCount}</span>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
                Register for upcoming events!
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {loading ? <div className="text-slate-300">Loading…</div> : null}
          {filtered.length === 0 ? <div className="text-slate-400">No events found.</div> : null}

          {filtered.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={register}
              isRegistered={isRegistered(event._id)}
              showAdminActions={isAdmin}
              onEdit={openEdit}
              onDelete={deleteEvent}
            />
          ))}
        </div>

        <div className="text-center text-xs text-slate-500 mt-10">
          RBAC: Admin manages events. Users view & register.
        </div>
      </div>

      {/* Admin create/edit modal */}
      <Modal open={openForm} title={editing ? "Edit Event (Admin)" : "Create Event (Admin)"} onClose={() => setOpenForm(false)}>
        <form onSubmit={saveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Event Name" required value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} />
          <Input label="Event Date" required type="date" value={form.date} onChange={(e)=>setForm(f=>({...f,date:e.target.value}))} />
          <Input label="Location" value={form.location} onChange={(e)=>setForm(f=>({...f,location:e.target.value}))} placeholder="Seminar Hall / Online" />
          <label className="block">
            <div className="text-sm text-slate-300 mb-1">Type</div>
            <select
              value={form.type}
              onChange={(e)=>setForm(f=>({...f,type:e.target.value}))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Hackathon</option>
              <option>Cultural</option>
              <option>Sports</option>
            </select>
          </label>
          <Input className="md:col-span-2" label="Keywords (comma separated)" value={form.keywords} onChange={(e)=>setForm(f=>({...f,keywords:e.target.value}))} placeholder="AI, cloud, coding" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={generateAI}><Wand2 size={16}/> AI Generate</Button>
          </div>
          <Textarea className="md:col-span-2" label="Event Description" value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} placeholder="Generate using AI or type manually..." />
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={()=>setOpenForm(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
