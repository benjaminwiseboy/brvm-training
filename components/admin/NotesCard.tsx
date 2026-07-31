"use client";

import { useState, useTransition } from "react";
import { addAdminNote } from "@/lib/actions/admin";
import styles from "./NotesCard.module.css";

export type AdminNote = { id: string; body: string; authorEmail: string | null; createdAt: string };

export function NotesCard({ userId, initialNotes }: { userId: string; initialNotes: AdminNote[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    const body = draft.trim();
    if (!body) return;
    // Optimiste (id temporaire) — la revalidation côté serveur (revalidatePath
    // dans addAdminNote) remplacera cette liste par les vraies notes au
    // prochain rendu, même pattern que ModuleAccessGrid.
    setNotes((prev) => [{ id: `tmp-${Date.now()}`, body, authorEmail: null, createdAt: new Date().toISOString() }, ...prev]);
    setDraft("");
    startTransition(() => {
      addAdminNote(userId, body);
    });
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>Notes internes</div>

      {notes.length === 0 ? (
        <p className={styles.empty}>Aucune note pour l&apos;instant.</p>
      ) : (
        <div className={styles.list}>
          {notes.map((note) => (
            <div key={note.id} className={styles.note}>
              <p className={styles.noteBody}>{note.body}</p>
              <div className={styles.noteMeta}>
                {note.authorEmail ? `${note.authorEmail} · ` : ""}
                {new Date(note.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Ajouter une note..."
        className={styles.textarea}
      />
      <button type="button" className={styles.addBtn} onClick={submit} disabled={isPending || !draft.trim()}>
        Ajouter la note
      </button>
    </div>
  );
}
