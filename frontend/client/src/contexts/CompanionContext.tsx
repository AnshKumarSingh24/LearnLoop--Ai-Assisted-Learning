import { createContext, useContext, useMemo, useState } from "react";

export type CompanionState =
  | "idle"
  | "observing"
  | "explaining"
  | "prompting"
  | "celebrating"
  | "needs-attention";

export type CompanionPersonality =
  | "calm"
  | "curious"
  | "energetic"
  | "academic"
  | "direct";

export type CompanionTone =
  | "encouraging"
  | "concise"
  | "socratic"
  | "detailed";

export type CompanionContextState = {
  workspace: string;
  course?: string;
  source?: string;
  selection?: string;
  spaceId?: string;
  pageId?: string;
};

export type CompanionProfile = {
  name: string;
  primaryColor: string;
  accentColor: string;
  personality: CompanionPersonality;
  tone: CompanionTone;
  bodyStyle: "orb" | "sprout" | "guide";
  accessory: "none" | "glasses" | "leaf" | "headphones";
  proactivePrompts: boolean;
};

export type CompanionAction =
  | "explain"
  | "summarize"
  | "quiz"
  | "connect"
  | "flashcards"
  | "next-step";

const defaultProfile: CompanionProfile = {
  name: "Darwin",
  primaryColor: "#123d2d",
  accentColor: "#e3b85c",
  personality: "curious",
  tone: "encouraging",
  bodyStyle: "sprout",
  accessory: "leaf",
  proactivePrompts: true,
};

const defaultContext: CompanionContextState = {
  workspace: "Home",
};

type CompanionContextValue = {
  profile: CompanionProfile;
  context: CompanionContextState;
  state: CompanionState;
  isOpen: boolean;
  setProfile: (profile: CompanionProfile) => void;
  setContext: (context: CompanionContextState) => void;
  setState: (state: CompanionState) => void;
  open: () => void;
  close: () => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [context, setContext] = useState(defaultContext);
  const [state, setState] = useState<CompanionState>("idle");
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      profile,
      context,
      state,
      isOpen,
      setProfile,
      setContext,
      setState,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [profile, context, state, isOpen],
  );

  return (
    <CompanionContext.Provider value={value}>
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const value = useContext(CompanionContext);
  if (!value) throw new Error("useCompanion must be used inside CompanionProvider");
  return value;
}
