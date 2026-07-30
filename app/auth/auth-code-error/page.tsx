import { AuthCard } from "@/components/auth/AuthCard";
import styles from "@/components/auth/AuthCard.module.css";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <AuthCard title="Lien invalide" subtitle="Ce lien a expiré ou a déjà été utilisé.">
      <p className={styles.footer}>
        <Link href="/login">Retour à la connexion</Link>
      </p>
    </AuthCard>
  );
}
