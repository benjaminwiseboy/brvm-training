/**
 * File "debounce + single-flight, la dernière valeur gagne" — pour les
 * écritures de progression vers Supabase (ex: `setResumeSlide` peut être
 * appelé des dizaines de fois par module). Ne dépend ni de React ni de
 * Supabase : testable avec `vi.useFakeTimers()`.
 *
 * - Les appels rapprochés à `schedule()` sont regroupés (debounce `delayMs`,
 *   trailing) : une seule exécution de `run`, avec la dernière valeur reçue.
 * - Si `run` est encore en cours quand le délai suivant expire, `schedule`
 *   attend la fin de cette exécution avant de relancer — jamais deux `run`
 *   concurrents, jamais plus d'une écriture en attente à la fois.
 */
export function createCoalescingQueue<T>(run: (value: T) => Promise<void>, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingValue: T | null = null;
  let hasPending = false;
  let inFlight: Promise<void> | null = null;

  function flush() {
    timer = null;
    if (!hasPending) return;
    const value = pendingValue as T;
    hasPending = false;
    pendingValue = null;
    inFlight = run(value).finally(() => {
      inFlight = null;
      if (hasPending) flush();
    });
  }

  function schedule(value: T) {
    pendingValue = value;
    hasPending = true;
    if (inFlight) return; // relancera automatiquement à la fin du run en cours
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, delayMs);
  }

  function flushNow() {
    if (timer) clearTimeout(timer);
    flush();
  }

  return { schedule, flushNow };
}
