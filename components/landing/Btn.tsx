import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "./Icons";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "navy" | "ghost" | "outline";
  size?: "md" | "lg";
  icon?: ReactNode;
  className?: string;
};

export default function Btn({
  href,
  children,
  variant = "gold",
  size = "md",
  icon,
  className = "",
}: Props) {
  const classes = ["btn", `btn--${variant}`, size === "lg" ? "btn--lg" : "", className]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span>{children}</span>
      <span className="btn__ico">{icon ?? <ArrowUpRight />}</span>
    </>
  );

  // Les ancres de la page restent des <a> ; les routes de l'app passent par
  // <Link> pour bénéficier du prefetch et de la navigation client.
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
