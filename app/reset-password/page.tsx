import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordRequestForm } from "@/components/auth/ResetPasswordRequestForm";

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Mot de passe oublié" subtitle="On vous envoie un lien de réinitialisation par email.">
      <ResetPasswordRequestForm />
    </AuthCard>
  );
}
