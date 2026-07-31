"use client";

import { useState, useTransition } from "react";
import { setModuleAccessMode, setPhaseAccessMode, type ModuleAccessMode } from "@/lib/actions/admin";
import styles from "./ModuleAccessGrid.module.css";

type PhaseGroup = {
  name: string;
  badge: string;
  modules: { code: string; title: string; autoLabel: string }[];
};

const MODE_LABEL: Record<ModuleAccessMode, string> = { auto: "Auto", open: "Ouvert", closed: "Fermé" };
const MODES = Object.keys(MODE_LABEL) as ModuleAccessMode[];

export function ModuleAccessGrid({
  userId,
  phases,
  initialModes,
}: {
  userId: string;
  phases: PhaseGroup[];
  initialModes: Record<string, ModuleAccessMode>;
}) {
  const [modes, setModes] = useState<Record<string, ModuleAccessMode>>(initialModes);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  function handleSet(code: string, mode: ModuleAccessMode) {
    // Optimiste : l'UI réagit immédiatement, le Server Action confirme en
    // tâche de fond (RLS + revérif admin restent la vraie barrière).
    setModes((prev) => ({ ...prev, [code]: mode }));
    startTransition(() => {
      setModuleAccessMode(userId, code, mode);
    });
  }

  function handleSetPhase(codes: string[], mode: ModuleAccessMode) {
    setModes((prev) => {
      const next = { ...prev };
      for (const code of codes) next[code] = mode;
      return next;
    });
    startTransition(() => {
      setPhaseAccessMode(userId, codes, mode);
    });
  }

  function toggleExpanded(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div>
      {phases.map((phase) => {
        const codes = phase.modules.map((m) => m.code);
        const phaseModes = codes.map((c) => modes[c] ?? "auto");
        const uniformMode = phaseModes.every((m) => m === phaseModes[0]) ? phaseModes[0] : null;
        const overrideCount = phaseModes.filter((m) => m !== "auto").length;
        const isOpen = expanded.has(phase.name);

        return (
          <div key={phase.name} className={styles.phase}>
            <div className={styles.phaseHead}>
              <button
                type="button"
                className={styles.phaseToggle}
                onClick={() => toggleExpanded(phase.name)}
                aria-expanded={isOpen}
              >
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>›</span>
                <span className={styles.phaseEmoji}>{phase.badge}</span>
                <span className={styles.phaseTitle}>{phase.name}</span>
                {overrideCount > 0 && (
                  <span className={styles.overrideBadge}>
                    {overrideCount} forcé{overrideCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>

              <div className={styles.segmented}>
                {MODES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`${styles.segBtn} ${uniformMode === opt ? styles[`segBtnActive_${opt}`] : ""}`}
                    onClick={() => handleSetPhase(codes, opt)}
                    title={`${MODE_LABEL[opt]} pour toute la phase`}
                  >
                    {MODE_LABEL[opt]}
                  </button>
                ))}
              </div>
            </div>

            {isOpen && (
              <div className={styles.grid}>
                {phase.modules.map((mod) => {
                  const mode = modes[mod.code] ?? "auto";
                  return (
                    <div key={mod.code} className={styles.row}>
                      <div className={styles.rowInfo}>
                        <div>
                          <span className={styles.code}>{mod.code}</span>
                          <span className={styles.title}>{mod.title}</span>
                        </div>
                        <div className={styles.autoLabel}>Automatique : {mod.autoLabel}</div>
                      </div>
                      <div className={styles.segmented}>
                        {MODES.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`${styles.segBtn} ${mode === opt ? styles[`segBtnActive_${opt}`] : ""}`}
                            onClick={() => handleSet(mod.code, opt)}
                          >
                            {MODE_LABEL[opt]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
