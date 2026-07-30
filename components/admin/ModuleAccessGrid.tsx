"use client";

import { useState, useTransition } from "react";
import { toggleModuleAccess } from "@/lib/actions/admin";
import styles from "./ModuleAccessGrid.module.css";

type PhaseGroup = { name: string; modules: { code: string; title: string }[] };

export function ModuleAccessGrid({
  userId,
  phases,
  initialBlocked,
}: {
  userId: string;
  phases: PhaseGroup[];
  initialBlocked: string[];
}) {
  const [blocked, setBlocked] = useState<Set<string>>(new Set(initialBlocked));
  const [, startTransition] = useTransition();

  function handleToggle(code: string, allowed: boolean) {
    // Optimiste : l'UI réagit immédiatement, le Server Action confirme en
    // tâche de fond (RLS + revérif admin restent la vraie barrière).
    setBlocked((prev) => {
      const next = new Set(prev);
      if (allowed) next.delete(code);
      else next.add(code);
      return next;
    });
    startTransition(() => {
      toggleModuleAccess(userId, code, !allowed);
    });
  }

  return (
    <div>
      {phases.map((phase) => (
        <div key={phase.name} className={styles.phase}>
          <h3 className={styles.phaseTitle}>{phase.name}</h3>
          <div className={styles.grid}>
            {phase.modules.map((mod) => {
              const isBlocked = blocked.has(mod.code);
              return (
                <div key={mod.code} className={`${styles.row} ${isBlocked ? styles.rowBlocked : ""}`}>
                  <div>
                    <span className={styles.code}>{mod.code}</span>
                    <span className={styles.title}>{mod.title}</span>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={!isBlocked}
                      onChange={(e) => handleToggle(mod.code, e.target.checked)}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
