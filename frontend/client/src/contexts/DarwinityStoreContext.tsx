import { createContext, useContext, useReducer, useEffect } from "react";
import { DarwinityState, Space, Page, Course } from "@/types/darwinity";
import { loadDarwinityState, saveDarwinityState } from "@/lib/persistence";

type Action =
  | { type: "CREATE_SPACE"; space: Space }
  | { type: "UPDATE_SPACE"; id: string; patch: Partial<Space> }
  | { type: "ARCHIVE_SPACE"; id: string }
  | { type: "DELETE_SPACE"; id: string }
  | { type: "CREATE_PAGE"; page: Page }
  | { type: "UPDATE_PAGE"; id: string; patch: Partial<Page> }
  | { type: "DELETE_PAGE"; id: string }
  | { type: "CREATE_COURSE"; course: Course }
  | { type: "UPDATE_COURSE"; id: string; patch: Partial<Course> }
  | { type: "SET_ACTIVE_SPACE"; id: string | null }
  | { type: "SET_ACTIVE_PAGE"; id: string | null }
  | { type: "SET_ACTIVE_COURSE"; id: string | null }
  | { type: "CREATE_BLOCK"; block: any }
  | { type: "UPDATE_BLOCK"; id: string; patch: any }
  | { type: "DELETE_BLOCK"; id: string }
  | { type: "CREATE_ATTRIBUTE"; attribute: any }
  | { type: "UPDATE_ATTRIBUTE"; id: string; patch: any }
  | { type: "DELETE_ATTRIBUTE"; id: string }
  | { type: "SET_VALUE"; value: any }
  | { type: "DELETE_VALUE"; id: string };

function darwinityReducer(state: DarwinityState, action: Action): DarwinityState {
  switch (action.type) {
    case "CREATE_SPACE":
      return { ...state, spaces: [...state.spaces, action.space] };
    case "UPDATE_SPACE":
      return {
        ...state,
        spaces: state.spaces.map((s) => (s.id === action.id ? { ...s, ...action.patch, updatedAt: new Date().toISOString() } : s)),
      };
    case "ARCHIVE_SPACE":
      return {
        ...state,
        spaces: state.spaces.map((s) => (s.id === action.id ? { ...s, archived: true } : s)),
      };
    case "DELETE_SPACE":
      return {
        ...state,
        spaces: state.spaces.filter((s) => s.id !== action.id),
      };
    case "CREATE_PAGE":
      return { ...state, pages: [...state.pages, action.page] };
    case "UPDATE_PAGE":
      return {
        ...state,
        pages: state.pages.map((p) => (p.id === action.id ? { ...p, ...action.patch, updatedAt: new Date().toISOString() } : p)),
      };
    case "DELETE_PAGE":
      return {
        ...state,
        pages: state.pages.filter((p) => p.id !== action.id),
      };
    case "CREATE_COURSE":
      return { ...state, courses: [...state.courses, action.course] };
    case "UPDATE_COURSE":
      return {
        ...state,
        courses: state.courses.map((c) => (c.id === action.id ? { ...c, ...action.patch, updatedAt: new Date().toISOString() } : c)),
      };
    case "SET_ACTIVE_SPACE":
      return { ...state, activeSpaceId: action.id };
    case "SET_ACTIVE_PAGE":
      return { ...state, activePageId: action.id };
    case "SET_ACTIVE_COURSE":
      return { ...state, activeCourseId: action.id };
    case "CREATE_BLOCK":
      return { ...state, blocks: [...(state.blocks || []), action.block] };
    case "UPDATE_BLOCK":
      return { ...state, blocks: (state.blocks || []).map((b) => b.id === action.id ? { ...b, ...action.patch } : b) };
    case "DELETE_BLOCK":
      return { ...state, blocks: (state.blocks || []).filter((b) => b.id !== action.id) };
    case "CREATE_ATTRIBUTE":
      return { ...state, attributes: [...(state.attributes || []), action.attribute] };
    case "UPDATE_ATTRIBUTE":
      return { ...state, attributes: (state.attributes || []).map((a) => a.id === action.id ? { ...a, ...action.patch } : a) };
    case "DELETE_ATTRIBUTE":
      return { ...state, attributes: (state.attributes || []).filter((a) => a.id !== action.id) };
    case "SET_VALUE": {
      const vals = state.values || [];
      const exists = vals.find(v => v.pageId === action.value.pageId && v.attributeId === action.value.attributeId);
      if (exists) {
        return { ...state, values: vals.map(v => v.id === exists.id ? { ...v, value: action.value.value } : v) };
      }
      return { ...state, values: [...vals, action.value] };
    }
    case "DELETE_VALUE":
      return { ...state, values: (state.values || []).filter(v => v.id !== action.id) };
    default:
      return state;
  }
}

type DarwinityContextType = {
  state: DarwinityState;
  dispatch: React.Dispatch<Action>;
};

const DarwinityContext = createContext<DarwinityContextType | null>(null);

export function DarwinityStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(darwinityReducer, undefined, loadDarwinityState);

  useEffect(() => {
    saveDarwinityState(state);
  }, [state]);

  return (
    <DarwinityContext.Provider value={{ state, dispatch }}>
      {children}
    </DarwinityContext.Provider>
  );
}

export function useDarwinity() {
  const context = useContext(DarwinityContext);
  if (!context) {
    throw new Error("useDarwinity must be used within a DarwinityStoreProvider");
  }
  return context;
}
