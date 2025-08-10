import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  CalendarDays, Clock, MapPin, Printer, Search, BookOpen, Users, Globe,
  ChevronDown, GraduationCap, Music, Volume2, BookMarked, Plus, Edit, Trash2,
  Save, X, Calendar, Bell, Download, Upload, TrendingUp, BarChart3, PieChart,
  Timer, Target, Zap, Check
} from "lucide-react";

/* =======================
   1) DATOS DEL HORARIO
   ======================= */
const DEFAULT_HORARIO = [
  {
    dia: "Lunes", fecha: "1", cursos: [
      {
        id: 1, nombre: "Creatividad Empresarial", inicio: "13:30", fin: "15:45",
        salon: "A0619", modalidad: "Presencial", profesor: "Dr. García López",
        color: "blue", creditos: 3, tipo: "Obligatorio", prioridad: "alta",
        notas: "", recordatorio: false, completado: false
      },
      {
        id: 2, nombre: "Planeamiento y Control de Operaciones", inicio: "20:15", fin: "21:45",
        salon: "B0602", modalidad: "Presencial", profesor: "Ing. María Santos",
        color: "green", creditos: 4, tipo: "Obligatorio", prioridad: "alta",
        notas: "", recordatorio: false, completado: false
      }
    ]
  },
  {
    dia: "Martes", fecha: "2", cursos: [
      {
        id: 3, nombre: "Logística", inicio: "12:00", fin: "13:30",
        salon: "B0601", modalidad: "Presencial", profesor: "Mg. Juan Pérez",
        color: "purple", creditos: 3, tipo: "Obligatorio", prioridad: "media",
        notas: "", recordatorio: false, completado: false
      },
      {
        id: 4, nombre: "Ingeniería Económica", inicio: "13:30", fin: "15:45",
        salon: "A0311", modalidad: "Presencial", profesor: "Dr. Ana Torres",
        color: "orange", creditos: 4, tipo: "Obligatorio", prioridad: "alta",
        notas: "", recordatorio: false, completado: false
      },
      {
        id: 5, nombre: "Planeamiento y Control de Operaciones", inicio: "20:15", fin: "21:45",
        salon: "B0602", modalidad: "Presencial", profesor: "Ing. María Santos",
        color: "green", creditos: 4, tipo: "Obligatorio", prioridad: "alta",
        notas: "", recordatorio: false, completado: false
      }
    ]
  },
  {
    dia: "Miércoles", fecha: "3", cursos: [
      {
        id: 6, nombre: "Logística", inicio: "12:00", fin: "13:30",
        salon: "B0603", modalidad: "Presencial", profesor: "Mg. Juan Pérez",
        color: "purple", creditos: 3, tipo: "Obligatorio", prioridad: "media",
        notas: "", recordatorio: false, completado: false
      },
      {
        id: 7, nombre: "Simulación", inicio: "15:30", fin: "17:00",
        salon: "A0310", modalidad: "Híbrido", profesor: "Dr. Carlos Ruiz",
        color: "teal", creditos: 3, tipo: "Electivo", prioridad: "baja",
        notas: "", recordatorio: false, completado: false
      }
    ]
  },
  {
    dia: "Jueves", fecha: "4", cursos: [
      {
        id: 8, nombre: "Simulación", inicio: "15:30", fin: "17:00",
        salon: "A0310", modalidad: "Híbrido", profesor: "Dr. Carlos Ruiz",
        color: "teal", creditos: 3, tipo: "Electivo", prioridad: "baja",
        notas: "", recordatorio: false, completado: false
      }
    ]
  },
  { dia: "Viernes", fecha: "5", cursos: [] }
];

/* =======================
   2) UTILIDADES Y CONSTANTES
   ======================= */
const COLORES = {
  blue: "bg-blue-500/20 border-blue-300/50 text-blue-100 shadow-blue-500/20",
  green: "bg-green-500/20 border-green-300/50 text-green-100 shadow-green-500/20",
  purple: "bg-purple-500/20 border-purple-300/50 text-purple-100 shadow-purple-500/20",
  orange: "bg-orange-500/20 border-orange-300/50 text-orange-100 shadow-orange-500/20",
  teal: "bg-teal-500/20 border-teal-300/50 text-teal-100 shadow-teal-500/20",
  red: "bg-red-500/20 border-red-300/50 text-red-100 shadow-red-500/20",
  pink: "bg-pink-500/20 border-pink-300/50 text-pink-100 shadow-pink-500/20",
  indigo: "bg-indigo-500/20 border-indigo-300/50 text-indigo-100 shadow-indigo-500/20"
};

const PRIORIDAD_COLORS = {
  alta: "bg-red-500/10 border-red-400/30 text-red-300",
  media: "bg-yellow-500/10 border-yellow-400/30 text-yellow-300",
  baja: "bg-green-500/10 border-green-400/30 text-green-300"
};

const STATS_COLORS = {
  blue: { box: "bg-blue-900/40", icon: "text-blue-300" },
  green: { box: "bg-green-900/40", icon: "text-green-300" },
  purple: { box: "bg-purple-900/40", icon: "text-purple-300" },
  orange: { box: "bg-orange-900/40", icon: "text-orange-300" }
};

const formatTime = (t) => {
  const [h, m] = t.split(":");
  return new Date(0, 0, 0, Number(h), Number(m));
};

const getDuration = (inicio, fin) => {
  const diff = (formatTime(fin) - formatTime(inicio)) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m ? m + "m" : ""}` : `${m}m`;
};

const getModalidadIcon = (modalidad) => {
  switch (modalidad) {
    case "Presencial": return <Users className="h-4 w-4" />;
    case "Virtual":   return <Globe className="h-4 w-4" />;
    case "Híbrido":   return <BookOpen className="h-4 w-4" />;
    default:           return <Clock className="h-4 w-4" />;
  }
};

const getPrioridadIcon = (prioridad) => {
  switch (prioridad) {
    case "alta":  return <Zap className="h-3 w-3" />;
    case "media": return <Target className="h-3 w-3" />;
    case "baja":  return <Timer className="h-3 w-3" />;
    default:       return <Timer className="h-3 w-3" />;
  }
};

/* =======================
   3) HOOKS
   ======================= */
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};


// Select estilado (reemplaza al <select> nativo)
const CustomSelect = ({ value, onChange, options, className = "", icon: Icon }) => {
  // options: Array<{ value: string, label: string }>
  const [open, setOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open) setHoverIndex(options.findIndex((o) => o.value === value));
  }, [open, value, options]);

  const currentLabel = options.find((o) => o.value === value)?.label ?? options[0]?.label;

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") setHoverIndex((i) => Math.min(options.length - 1, i + 1));
    if (e.key === "ArrowUp") setHoverIndex((i) => Math.max(0, i - 1));
    if (e.key === "Enter") {
      const opt = options[Math.max(0, hoverIndex)];
      if (opt) { onChange(opt.value); setOpen(false); }
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-600 bg-zinc-800/60 text-zinc-100 text-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        aria-haspopup="listbox" aria-expanded={open}
      >
        {Icon && <Icon className="h-4 w-4 opacity-70" />}
        <span className="truncate max-w-[12rem] text-left">{currentLabel}</span>
        <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 mt-2 w-56 rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur p-1 shadow-2xl z-50 origin-top animate-[scaleIn_.12s_ease-out]"
          style={{
            '--tw-shadow-color': 'rgba(0,0,0,.6)'
          }}
        >
          {options.map((opt, i) => {
            const active = opt.value === value;
            const hovered = i === hoverIndex;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(-1)}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  active ? 'bg-blue-600/20 text-blue-200' : hovered ? 'bg-white/5 text-zinc-100' : 'text-zinc-300'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes scaleIn { from { opacity:.5; transform: scale(.98) translateY(-2px); } to { opacity:1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
};
const Modal = ({ isOpen, onClose, title, children }) => {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      aria-modal="true" role="dialog"
    >
      <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const CourseForm = ({ curso, onSave, onCancel }) => {
  const [formData, setFormData] = useState(curso || {
    nombre: "", inicio: "", fin: "", salon: "", modalidad: "Presencial",
    profesor: "", color: "blue", creditos: 3, tipo: "Obligatorio",
    prioridad: "media", notas: "", recordatorio: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación simple de horario
    if (formatTime(formData.fin) <= formatTime(formData.inicio)) {
      alert("La hora de fin debe ser mayor que la de inicio.");
      return;
    }
    onSave({ ...formData, id: curso?.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nombre del curso"
        value={formData.nombre}
        onChange={(e) => setFormData((p) => ({ ...p, nombre: e.target.value }))}
        className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="time"
          value={formData.inicio}
          onChange={(e) => setFormData((p) => ({ ...p, inicio: e.target.value }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
          required
        />
        <input
          type="time"
          value={formData.fin}
          onChange={(e) => setFormData((p) => ({ ...p, fin: e.target.value }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Salón"
        value={formData.salon}
        onChange={(e) => setFormData((p) => ({ ...p, salon: e.target.value }))}
        className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        required
      />

      <input
        type="text"
        placeholder="Profesor"
        value={formData.profesor}
        onChange={(e) => setFormData((p) => ({ ...p, profesor: e.target.value }))}
        className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          value={formData.modalidad}
          onChange={(e) => setFormData((p) => ({ ...p, modalidad: e.target.value }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        >
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Híbrido">Híbrido</option>
        </select>

        <select
          value={formData.prioridad}
          onChange={(e) => setFormData((p) => ({ ...p, prioridad: e.target.value }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        >
          <option value="alta">Alta prioridad</option>
          <option value="media">Media prioridad</option>
          <option value="baja">Baja prioridad</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <select
          value={formData.color}
          onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        >
          {Object.keys(COLORES).map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>

        <input
          type="number" min="1" max="6"
          value={formData.creditos}
          onChange={(e) => setFormData((p) => ({ ...p, creditos: Number(e.target.value) }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
          placeholder="Créditos"
        />

        <select
          value={formData.tipo}
          onChange={(e) => setFormData((p) => ({ ...p, tipo: e.target.value }))}
          className="p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        >
          <option value="Obligatorio">Obligatorio</option>
          <option value="Electivo">Electivo</option>
        </select>
      </div>

      <textarea
        placeholder="Notas del curso..."
        value={formData.notas}
        onChange={(e) => setFormData((p) => ({ ...p, notas: e.target.value }))}
        className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 h-24"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.recordatorio}
          onChange={(e) => setFormData((p) => ({ ...p, recordatorio: e.target.checked }))}
          className="w-4 h-4"
        />
        <span className="text-zinc-300">Activar recordatorios</span>
      </label>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
          <Save className="h-4 w-4 inline mr-2" /> Guardar
        </button>
        <button type="button" onClick={onCancel} className="px-6 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-3 rounded-lg">
          Cancelar
        </button>
      </div>
    </form>
  );
};

const DayPill = ({ label, active, onClick, courseCount, completedCount }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all border group ${
      active
        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25"
        : "bg-white/5 backdrop-blur border-zinc-600 hover:bg-white/10 hover:shadow-md text-zinc-200"
    }`}
  >
    {label}
    {courseCount > 0 && (
      <div className="absolute -top-1 -right-1 flex">
        <span className={`h-5 w-5 text-xs rounded-full flex items-center justify-center font-bold ${
          active ? "bg-white text-blue-600" : "bg-blue-600 text-white"
        }`}>
          {courseCount}
        </span>
        {completedCount > 0 && (
          <span className="h-3 w-3 bg-green-500 rounded-full -ml-1 mt-3 border border-zinc-800"></span>
        )}
      </div>
    )}
  </button>
);

const CursoCard = ({ curso, onEdit, onDelete, onToggleComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const duration = getDuration(curso.inicio, curso.fin);
  const colorClass = COLORES[curso.color] || COLORES.blue;
  const prioridadClass = PRIORIDAD_COLORS[curso.prioridad] || PRIORIDAD_COLORS.media;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border backdrop-blur p-5 shadow-lg hover:shadow-xl transition-all duration-300 ${colorClass} ${
      curso.completado ? 'opacity-75 ring-2 ring-green-500/50' : ''
    }`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 bg-gradient-to-br from-current to-transparent blur-2xl" />

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(curso)} className="p-1 rounded-lg bg-black/20 hover:bg-black/40" aria-label="Editar">
          <Edit className="h-3 w-3" />
        </button>
        <button onClick={() => onDelete(curso.id)} className="p-1 rounded-lg bg-black/20 hover:bg-black/40" aria-label="Eliminar">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-current/20 border border-current/30 font-medium">
                {getModalidadIcon(curso.modalidad)} {curso.modalidad}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${prioridadClass}`}>
                {getPrioridadIcon(curso.prioridad)} {curso.prioridad}
              </span>
              <span className="opacity-75">{curso.creditos} créditos</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-current/10 border border-current/20 text-xs">
                {curso.tipo}
              </span>
              {curso.recordatorio && <Bell className="h-3 w-3 text-yellow-400" />}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => onToggleComplete(curso.id)}
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  curso.completado ? 'bg-green-500 border-green-500' : 'border-current hover:bg-current/20'
                }`}
                aria-label={curso.completado ? 'Marcar como no completado' : 'Marcar como completado'}
              >
                {curso.completado && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
              <h3 className={`text-lg font-bold leading-tight ${curso.completado ? 'line-through opacity-60' : ''}`}>
                {curso.nombre}
              </h3>
            </div>
            <p className="text-sm opacity-80 font-medium">{curso.profesor}</p>
          </div>

          <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-current/20 rounded-lg" aria-label="Expandir">
            <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-75" />
            <span className="font-medium">{curso.inicio} – {curso.fin}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 opacity-75" />
            <span>{curso.salon}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-current/20 space-y-3 text-sm animate-in">
            <div className="flex items-center justify-between">
              <span className="font-medium">Duración:</span>
              <span>{duration}</span>
            </div>
            {curso.notas && (
              <div>
                <span className="font-medium block mb-1">Notas:</span>
                <p className="text-xs opacity-80 bg-current/10 rounded-lg p-2">{curso.notas}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              <button className="px-2 py-1 rounded-lg bg-current/10 hover:bg-current/20 transition-colors text-xs">
                <MapPin className="h-3 w-3 inline mr-1" /> Ver en mapa
              </button>
              <button className="px-2 py-1 rounded-lg bg-current/10 hover:bg-current/20 transition-colors text-xs">
                <Bell className="h-3 w-3 inline mr-1" /> Recordatorio
              </button>
              <button className="px-2 py-1 rounded-lg bg-current/10 hover:bg-current/20 transition-colors text-xs">
                <Calendar className="h-3 w-3 inline mr-1" /> Añadir al calendario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color = "blue", subtitle }) => {
  const c = STATS_COLORS[color] || STATS_COLORS.blue;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 backdrop-blur p-4 hover:bg-zinc-800/80 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${c.box}`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-xl font-bold text-zinc-100">{value}</p>
          {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

/* =======================
   5) COMPONENTE PRINCIPAL (MODO OSCURO FIJO)
   ======================= */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
      <GraduationCap className="h-10 w-10 opacity-50" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-zinc-200">¡Día libre!</h3>
    <p className="text-zinc-400 text-center mb-4">
      No tienes clases programadas para este día. ¡Perfecto para estudiar o descansar!
    </p>
  </div>
);

export default function HorarioAvanzado() {
  const [horario, setHorario] = useLocalStorage("horario", DEFAULT_HORARIO);
  const [selected, setSelected] = useLocalStorage("diaSeleccionado", DEFAULT_HORARIO[0].dia);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalidad, setFilterModalidad] = useState("Todas");
  const [filterPrioridad, setFilterPrioridad] = useState("Todas");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Enforce dark mode (por si el html no tiene class="dark")
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  // Audio
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useLocalStorage("musicSrc", "/music/lofi.mp3");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useLocalStorage("musicVol", 0.2);
  const [loop, setLoop] = useLocalStorage("musicLoop", true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
    }
  }, [volume, loop]);

  const handlePickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioSrc(url);
  };

  const toggleMusic = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (!musicPlaying) {
      try {
        el.volume = 0;
        await el.play();
        setMusicPlaying(true);
        const id = setInterval(() => {
          if (el.volume < volume) el.volume = Math.min(el.volume + 0.02, volume); else clearInterval(id);
        }, 50);
      } catch (err) { console.warn("Autoplay bloqueado:", err); }
    } else {
      const id = setInterval(() => {
        if (el.volume > 0.02) el.volume = Math.max(el.volume - 0.02, 0);
        else { el.pause(); el.currentTime = 0; el.volume = volume; setMusicPlaying(false); clearInterval(id); }
      }, 50);
    }
  };

  // Gestión de cursos
  const handleSaveCourse = (courseData) => {
    const nuevo = horario.map((dia) => {
      if (dia.dia !== selected) return dia;
      const exists = dia.cursos.find((c) => c.id === courseData.id);
      const cursos = exists ? dia.cursos.map((c) => (c.id === courseData.id ? courseData : c)) : [...dia.cursos, courseData];
      // ordenar por inicio
      cursos.sort((a, b) => formatTime(a.inicio) - formatTime(b.inicio));
      return { ...dia, cursos };
    });
    setHorario(nuevo);
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    const nuevo = horario.map((dia) => ({ ...dia, cursos: dia.cursos.filter((c) => c.id !== courseId) }));
    setHorario(nuevo);
  };

  const handleToggleComplete = (courseId) => {
    const nuevo = horario.map((dia) => ({
      ...dia,
      cursos: dia.cursos.map((c) => (c.id === courseId ? { ...c, completado: !c.completado } : c))
    }));
    setHorario(nuevo);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(horario, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const name = `horario_${new Date().toISOString().split('T')[0]}.json`;
    const a = document.createElement('a');
    a.setAttribute('href', dataUri);
    a.setAttribute('download', name);
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        setHorario(imported);
        setSelected(imported[0]?.dia || DEFAULT_HORARIO[0].dia);
      } catch { alert('Error al importar el archivo'); }
    };
    reader.readAsText(file);
  };

  // Derivados
  const dataDia = useMemo(() => horario.find((d) => d.dia === selected), [selected, horario]);

  const cursosStats = useMemo(() => {
    const all = horario.flatMap((d) => d.cursos);
    const totalCursos = all.length;
    const totalCreditos = all.reduce((s, c) => s + c.creditos, 0);
    const completados = all.filter((c) => c.completado).length;
    const modalidades = [...new Set(all.map((c) => c.modalidad))];
    const avgCreditos = totalCursos ? (totalCreditos / totalCursos).toFixed(1) : 0;
    const progreso = totalCursos ? Math.round((completados / totalCursos) * 100) : 0;
    return { totalCursos, totalCreditos, completados, modalidades: modalidades.length, avgCreditos, progreso };
  }, [horario]);

  const cursosFilteredAndSearched = useMemo(() => {
    if (!dataDia) return [];
    return dataDia.cursos.filter((curso) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        curso.nombre.toLowerCase().includes(q) ||
        curso.profesor.toLowerCase().includes(q) ||
        curso.salon.toLowerCase().includes(q);
      const matchesModalidad = filterModalidad === "Todas" || curso.modalidad === filterModalidad;
      const matchesPrioridad = filterPrioridad === "Todas" || curso.prioridad === filterPrioridad;
      return matchesSearch && matchesModalidad && matchesPrioridad;
    });
  }, [dataDia, searchTerm, filterModalidad, filterPrioridad]);

  const modalidades = useMemo(
    () => ["Todas", ...new Set(horario.flatMap((d) => d.cursos.map((c) => c.modalidad)))],
    [horario]
  );
  const prioridades = useMemo(
    () => ["Todas", ...new Set(horario.flatMap((d) => d.cursos.map((c) => c.prioridad)))],
    [horario]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-zinc-50">
      {/* Estilos y partículas */}
      <style>{`
        .bg-particles::before { content: ''; position: fixed; inset: 0; background:
          radial-gradient(circle at 25% 25%, rgba(59,130,246,.12) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(147,51,234,.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(6,182,212,.08) 0%, transparent 50%);
          pointer-events: none; z-index: -1; }
        @media print { header button, footer { display: none !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
          .grid { display: block !important; } .grid > * { margin-bottom: 1rem; } }
        .animate-in { animation: slideIn .2s ease-out; }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="bg-particles mx-auto max-w-7xl px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-sm text-blue-200 bg-blue-900/60 border border-blue-700/60 px-3 py-1.5 rounded-full mb-4 backdrop-blur">
              <CalendarDays className="h-4 w-4" />
              <span>Semestre 2025-II</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Mi Horario Inteligente
            </h1>
            <p className="text-lg text-zinc-300 max-w-md">Gestiona tu semana académica con herramientas avanzadas de productividad.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatsCard icon={BookMarked} label="Cursos" value={cursosStats.totalCursos} subtitle={`${cursosStats.completados} completados`} color="blue" />
            <StatsCard icon={GraduationCap} label="Créditos" value={cursosStats.totalCreditos} subtitle={`${cursosStats.avgCreditos} promedio`} color="green" />
            <StatsCard icon={TrendingUp} label="Progreso" value={`${cursosStats.progreso}%`} color="purple" />
            <StatsCard icon={BarChart3} label="Modalidades" value={cursosStats.modalidades} color="orange" />
          </div>
        </header>

        {/* Controles */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            <input
              type="text"
              placeholder="Buscar cursos, profesores o salón..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-600 bg-zinc-800/60 backdrop-blur focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-zinc-100 placeholder-zinc-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect
              value={filterModalidad}
              onChange={setFilterModalidad}
              options={modalidades.map((m) => ({ value: m, label: m === "Todas" ? "Todas las modalidades" : m }))}
            />

            <CustomSelect
              value={filterPrioridad}
              onChange={setFilterPrioridad}
              options={prioridades.map((p) => ({ value: p, label: p === "Todas" ? "Todas las prioridades" : `Prioridad ${p}` }))}
            />

            <button onClick={() => { setEditingCourse(null); setShowModal(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-600 bg-green-600/20 text-green-300 hover:bg-green-600/30 transition-all text-sm font-medium">
              <Plus className="h-4 w-4" /> Agregar curso
            </button>

            {/* Música */}
            <div className="flex items-center gap-2 border-l border-zinc-600 pl-3">
              <button onClick={toggleMusic} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-800/60 backdrop-blur transition-all text-sm ${musicPlaying ? 'bg-blue-900/60 border-blue-600 text-blue-300' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                {musicPlaying ? <Volume2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                <span className="hidden sm:inline">{musicPlaying ? 'Pausar' : 'Música'}</span>
              </button>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-20 accent-blue-500" title="Volumen" />
              <label className="inline-flex items-center gap-1 text-xs text-zinc-400">
                <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="w-3 h-3" /> Loop
              </label>
              <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-600 bg-zinc-800/60 cursor-pointer hover:shadow-md text-xs text-zinc-300">
                <Upload className="h-3 w-3" /> MP3<input type="file" accept="audio/*" hidden onChange={handlePickFile} />
              </label>
            </div>

            {/* Export / Import / Stats / Print */}
            <div className="flex items-center gap-2 border-l border-zinc-600 pl-3">
              <button onClick={() => setShowStats(!showStats)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-800/60 hover:bg-zinc-800 transition-all text-sm text-zinc-300">
                <PieChart className="h-4 w-4" /> <span className="hidden sm:inline">Stats</span>
              </button>
              <button onClick={exportData} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-800/60 hover:bg-zinc-800 transition-all text-sm text-zinc-300">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Exportar</span>
              </button>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-800/60 cursor-pointer hover:bg-zinc-800 transition-all text-sm text-zinc-300">
                <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Importar</span>
                <input type="file" accept=".json" hidden onChange={importData} />
              </label>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-600 bg-zinc-800/60 hover:bg-zinc-800 transition-all text-sm text-zinc-300">
                <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selector de día */}
        <div className="flex flex-wrap gap-3 mb-8">
          {horario.map((d) => {
            const completedCount = d.cursos.filter((c) => c.completado).length;
            return (
              <DayPill key={d.dia} label={`${d.dia} ${d.fecha}`} active={selected === d.dia} onClick={() => setSelected(d.dia)} courseCount={d.cursos.length} completedCount={completedCount} />
            );
          })}
        </div>

        {/* Contenido del día */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-100">
              {dataDia?.dia} {dataDia?.fecha}
              <span className="ml-3 text-sm font-normal opacity-60">
                {dataDia?.cursos.length === 0 ? 'Sin clases' : `${cursosFilteredAndSearched.length} de ${dataDia?.cursos.length} clases`}
              </span>
            </h2>
            {dataDia && dataDia.cursos.length > 0 && (
              <div className="text-sm text-zinc-400">{dataDia.cursos.filter((c) => c.completado).length} completadas</div>
            )}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {cursosFilteredAndSearched.length === 0 ? (
              dataDia?.cursos.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="col-span-full text-center py-8">
                  <Search className="h-12 w-12 mx-auto opacity-30 mb-3" />
                  <p className="text-lg font-medium opacity-60">No se encontraron cursos</p>
                  <p className="opacity-50">Intenta con otros términos de búsqueda</p>
                </div>
              )
            ) : (
              cursosFilteredAndSearched.map((curso) => (
                <CursoCard key={curso.id} curso={curso} onEdit={(c) => { setEditingCourse(c); setShowModal(true); }} onDelete={handleDeleteCourse} onToggleComplete={handleToggleComplete} />
              ))
            )}
          </div>
        </section>

        {/* Resumen semanal */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-zinc-100">Resumen semanal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {horario.map((d) => {
              const completados = d.cursos.filter((c) => c.completado).length;
              const total = d.cursos.length;
              return (
                <div key={`resumen-${d.dia}`} className="rounded-2xl border border-zinc-700 bg-zinc-800/60 backdrop-blur p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-zinc-100">{d.dia}</h3>
                    <div className="flex gap-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300">{total} clases</span>
                      {completados > 0 && <span className="text-xs px-2 py-1 rounded-full bg-green-700 text-green-300">{completados} ✓</span>}
                    </div>
                  </div>
                  {total === 0 ? (
                    <p className="text-sm text-zinc-400 italic">Día libre</p>
                  ) : (
                    <ul className="space-y-2">
                      {d.cursos.slice(0, 3).map((c) => (
                        <li key={c.id} className="text-xs">
                          <div className={`font-medium truncate text-zinc-200 ${c.completado ? 'line-through opacity-60' : ''}`}>{c.nombre}</div>
                          <div className="text-zinc-400 flex items-center justify-between"><span>{c.inicio} • {c.salon}</span>{c.completado && <span className="text-green-400">✓</span>}</div>
                        </li>
                      ))}
                      {d.cursos.length > 3 && <li className="text-xs text-zinc-500">+{d.cursos.length - 3} más...</li>}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-700 text-sm text-zinc-400 text-center">
          <p>Hecho con ❤️ para estudiantes organizados • <code>v3.1</code> </p>
        </footer>
      </div>

      {/* Modales */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCourse(null); }} title={editingCourse ? "Editar curso" : "Agregar nuevo curso"}>
        <CourseForm curso={editingCourse} onSave={handleSaveCourse} onCancel={() => { setShowModal(false); setEditingCourse(null); }} />
      </Modal>

      {/* Reproductor de audio */}
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
}



