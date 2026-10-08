import { useState } from "react";
import { ChevronDown, ChevronRight, PlayCircle } from "lucide-react";
import { useDarwinity } from "@/contexts/DarwinityStoreContext";
import { useLocation } from "wouter";

export function ActiveCoursesNav() {
  const { state } = useDarwinity();
  const [, setLocation] = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [draftsExpanded, setDraftsExpanded] = useState(false);

  const activeCourses = state.courses.filter(c => c.status === "active");
  const draftCourses = state.courses.filter(c => c.status === "draft" || c.status === "processing");

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-3 mb-2">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="flex items-center gap-1 text-xs font-bold text-[#8b8e9f] uppercase tracking-widest hover:text-white transition-colors"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          Active Courses
        </button>
      </div>

      {expanded && (
        <div className="space-y-1">
          {activeCourses.length === 0 ? (
            <div className="px-5 py-2 text-sm text-[#717585] italic">No active courses.</div>
          ) : (
            activeCourses.map(course => (
              <div 
                key={course.id}
                onClick={() => setLocation(`/courses/${course.id}`)}
                className={`group px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  state.activeCourseId === course.id ? "bg-[#25272e] border border-[#363945]" : "hover:bg-[#25272e] border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="shrink-0">{course.icon}</span>
                    <span className={`truncate text-sm ${state.activeCourseId === course.id ? 'font-bold text-white' : 'text-[#d1d5db]'}`}>
                      {course.title}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-white">{course.progress}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#2a2c35] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{ width: `${course.progress}%`, backgroundColor: course.accent }} 
                    />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setLocation(`/courses/${course.id}`); }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold text-[#c8f52c] uppercase tracking-wide transition-opacity"
                  >
                    <PlayCircle size={12} /> Resume
                  </button>
                </div>
              </div>
            ))
          )}


        </div>
      )}
    </div>
  );
}
