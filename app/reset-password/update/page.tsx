import { AuthCard } from "@/components/auth/AuthCard";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <AuthCard title="Nouveau mot de passe" subtitle="Choisissez votre nouveau mot de passe.">
      <UpdatePasswordForm />
    </AuthCard>
  );
}
