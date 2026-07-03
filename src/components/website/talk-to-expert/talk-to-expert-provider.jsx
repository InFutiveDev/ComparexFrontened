"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { TalkToExpertModal } from "@/components/website/talk-to-expert/talk-to-expert-section";

const TalkToExpertContext = createContext(null);

export function TalkToExpertProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openTalkToExpert = useCallback(() => setOpen(true), []);
  const closeTalkToExpert = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openTalkToExpert, closeTalkToExpert }),
    [openTalkToExpert, closeTalkToExpert]
  );

  return (
    <TalkToExpertContext.Provider value={value}>
      {children}
      <TalkToExpertModal open={open} onClose={closeTalkToExpert} />
    </TalkToExpertContext.Provider>
  );
}

export function useTalkToExpert() {
  const context = useContext(TalkToExpertContext);
  if (!context) {
    throw new Error("useTalkToExpert must be used within TalkToExpertProvider");
  }
  return context;
}
