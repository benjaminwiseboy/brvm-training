import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthCard title="Créer mon compte" subtitle="Sécurisez votre progression, sur tous vos appareils.">
      <SignupForm />
    </AuthCard>
  );
}
