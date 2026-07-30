import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createCoalescingQueue } from "./debounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("createCoalescingQueue", () => {
  it("regroupe les appels rapprochés : un seul run(), avec la dernière valeur", async () => {
    const calls: number[] = [];
    const run = vi.fn(async (v: number) => {
      calls.push(v);
    });
    const { schedule } = createCoalescingQueue(run, 500);

    schedule(1);
    schedule(2);
    schedule(3);

    await vi.advanceTimersByTimeAsync(500);

    expect(run).toHaveBeenCalledTimes(1);
    expect(calls).toEqual([3]);
  });

  it("attend la fin d'un run en cours avant de relancer avec la dernière valeur (jamais 2 run concurrents)", async () => {
    let resolveFirst: () => void = () => {};
    const firstPromise = new Promise<void>((resolve) => (resolveFirst = resolve));
    const calls: number[] = [];
    let inFlightCount = 0;
    let maxConcurrent = 0;

    const run = vi.fn(async (v: number) => {
      inFlightCount++;
      maxConcurrent = Math.max(maxConcurrent, inFlightCount);
      calls.push(v);
      if (v === 1) await firstPromise;
      inFlightCount--;
    });
    const { schedule } = createCoalescingQueue(run, 500);

    schedule(1);
    await vi.advanceTimersByTimeAsync(500); // déclenche run(1), qui reste en attente de firstPromise

    schedule(2); // arrive pendant que run(1) est en cours
    schedule(3); // écrase la valeur en attente : seule la dernière compte
    await vi.advanceTimersByTimeAsync(500); // aucun nouveau timer n'a dû démarrer (in-flight)

    expect(run).toHaveBeenCalledTimes(1); // run(3) pas encore lancé, run(1) toujours en cours

    resolveFirst(); // run(1) se termine
    await Promise.resolve();
    await Promise.resolve();

    expect(run).toHaveBeenCalledTimes(2);
    expect(calls).toEqual([1, 3]); // 2 a été écrasé par 3, jamais envoyé séparément
    expect(maxConcurrent).toBe(1); // jamais deux run() en vol simultanément
  });

  it("flushNow() déclenche immédiatement l'écriture en attente, sans attendre le délai", async () => {
    const calls: number[] = [];
    const run = vi.fn(async (v: number) => {
      calls.push(v);
    });
    const { schedule, flushNow } = createCoalescingQueue(run, 500);

    schedule(42);
    flushNow();
    await Promise.resolve();

    expect(run).toHaveBeenCalledTimes(1);
    expect(calls).toEqual([42]);
  });
});
