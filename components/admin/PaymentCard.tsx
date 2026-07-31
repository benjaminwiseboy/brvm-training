"use client";

import { useState, useTransition } from "react";
import { savePayment, type PaymentStatus } from "@/lib/actions/admin";
import { CURRENCIES, type Currency } from "@/lib/format";
import styles from "./PaymentCard.module.css";

const DEFAULT_AMOUNT = 40_000;
const DEFAULT_METHOD = "Mobile Money";

export function PaymentCard({
  userId,
  initialStatus,
  initialAmount,
  initialCurrency,
  initialMethod,
  initialPaidAt,
}: {
  userId: string;
  initialStatus: PaymentStatus;
  initialAmount: number | null;
  initialCurrency: Currency;
  initialMethod: string | null;
  initialPaidAt: string | null;
}) {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [amount, setAmount] = useState(String(initialAmount ?? DEFAULT_AMOUNT));
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [method, setMethod] = useState(initialMethod ?? DEFAULT_METHOD);
  const [paidAt, setPaidAt] = useState(initialPaidAt);
  const [isPending, startTransition] = useTransition();

  function save(nextStatus: PaymentStatus) {
    const parsedAmount = Number(amount);
    const finalAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null;
    // Ne repose "aujourd'hui" que sur un VRAI changement de statut vers
    // "payé" — un simple edit de montant/moyen sur un statut inchangé
    // garde la date de paiement d'origine.
    const nextPaidAt = nextStatus === "paid" ? (nextStatus !== status ? new Date().toISOString() : paidAt) : null;
    setStatus(nextStatus);
    setPaidAt(nextPaidAt);
    startTransition(() => {
      savePayment(userId, nextStatus, finalAmount, currency, method.trim() || null, nextPaidAt);
    });
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>Paiement</div>

      <div className={styles.statusRow}>
        <span className={status === "paid" ? styles.statusPaid : styles.statusUnpaid}>
          {status === "paid" ? "Payé" : "Impayé"}
        </span>
        <div className={styles.toggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${status === "paid" ? styles.toggleBtnActivePaid : ""}`}
            onClick={() => save("paid")}
            disabled={isPending}
          >
            Marquer payé
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${status === "unpaid" ? styles.toggleBtnActiveUnpaid : ""}`}
            onClick={() => save("unpaid")}
            disabled={isPending}
          >
            Marquer impayé
          </button>
        </div>
      </div>

      <div className={styles.amountRow}>
        <label className={styles.field}>
          <span>Montant</span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span>Devise</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className={styles.input}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={styles.field}>
        <span>Moyen</span>
        <input type="text" value={method} onChange={(e) => setMethod(e.target.value)} className={styles.input} />
      </label>
      {paidAt && <div className={styles.paidAt}>Marqué payé le {new Date(paidAt).toLocaleDateString("fr-FR")}</div>}

      <button type="button" className={styles.saveBtn} onClick={() => save(status)} disabled={isPending}>
        Enregistrer
      </button>
    </div>
  );
}
