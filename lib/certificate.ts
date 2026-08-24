/**
 * Rendu du certificat de fin de parcours en image (PNG), dessiné à la main
 * sur un `<canvas>`.
 *
 * Pourquoi le canvas plutôt qu'une capture du DOM : un certificat n'est
 * « partageable sur les réseaux sociaux » que s'il devient un FICHIER IMAGE
 * au bon format (1200 × 630, le ratio attendu par LinkedIn/Facebook/X et
 * lisible en vignette WhatsApp). Sérialiser le DOM en SVG puis le rasteriser
 * perdrait les polices (une image chargée depuis un data: URL n'a pas
 * accès aux webfonts de la page) ; le canvas 2D, lui, peut utiliser les
 * familles déjà chargées — d'où le paramètre `fonts`, dont les valeurs sont
 * lues par l'appelant via `getComputedStyle` (next/font génère des noms de
 * famille imprévisibles, qu'on ne peut pas écrire en dur ici).
 *
 * Aucune dépendance ajoutée : le projet n'embarque aucune librairie de
 * rendu, et ce fichier n'en a pas besoin.
 */

/** Dimensions logiques — ratio 1,91:1, le format d'aperçu social standard. */
export const CERT_WIDTH = 1200;
export const CERT_HEIGHT = 630;
/** Facteur de suréchantillonnage : le PNG sort en 2400 × 1260, net sur écran Retina. */
const SCALE = 2;

// Couleurs reprises telles quelles des tokens de globals.css — le canvas ne
// peut pas lire les variables CSS, ce sont donc les seules valeurs dupliquées.
const BLUE_1 = "#1C6E96";
const BLUE_2 = "#0E2F44";
const OR = "#F2B705";
const OR_LIGHT = "#F7CF49";
const INK_ON_DARK = "#DAE6EF";
const MUTED_ON_DARK = "#A9C2D4";

export type CertificateData = {
  /** Nom affiché sur le certificat (saisi par l'apprenant). */
  name: string;
  /** Date de délivrance, déjà formatée en français. */
  date: string;
  /** Portefeuille fictif final, déjà formaté (sans l'unité). */
  capital: string;
  modulesDone: number;
  statusLabel: string;
};

export type CertificateFonts = {
  /** Famille des titres (Poppins via next/font). */
  display: string;
  /** Famille du corps (Nunito via next/font). */
  body: string;
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  // `roundRect` est disponible partout où tourne l'app ; le repli manuel
  // évite quand même une exception sur un navigateur plus ancien.
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Réduit la taille de police jusqu'à ce que le texte tienne dans `maxWidth`
 * — un nom long ne doit pas déborder du cadre plutôt que d'être tronqué.
 */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: string,
  startSize: number,
  minSize: number,
  maxWidth: number
): number {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > minSize && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

/** Applique un interlettrage si le navigateur le gère (sinon : sans effet). */
function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = value;
  } catch {}
}

export function drawCertificate(
  ctx: CanvasRenderingContext2D,
  data: CertificateData,
  fonts: CertificateFonts
) {
  const W = CERT_WIDTH;
  const H = CERT_HEIGHT;

  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.clearRect(0, 0, W, H);

  // ---- Fond marine en dégradé + halo doré (comme les cartes de fin d'écran)
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, BLUE_1);
  bg.addColorStop(1, BLUE_2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const halo = ctx.createRadialGradient(W - 140, 60, 10, W - 140, 60, 420);
  halo.addColorStop(0, "rgba(242,183,5,0.20)");
  halo.addColorStop(1, "rgba(242,183,5,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // ---- Filet doré intérieur
  ctx.strokeStyle = "rgba(242,183,5,0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, 30, 30, W - 60, H - 60, 24);
  ctx.stroke();

  // ---- Marque
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  setLetterSpacing(ctx, "0.22em");
  ctx.font = `700 20px ${fonts.display}`;
  ctx.fillStyle = OR;
  ctx.fillText("BRVM LEARNING", 78, 104);

  // ---- Nature du document
  setLetterSpacing(ctx, "0.16em");
  ctx.font = `600 17px ${fonts.display}`;
  ctx.fillStyle = MUTED_ON_DARK;
  ctx.fillText("CERTIFICAT DE FIN DE PARCOURS", 78, 182);
  setLetterSpacing(ctx, "0em");

  // ---- Mention + nom
  ctx.font = `500 20px ${fonts.body}`;
  ctx.fillStyle = MUTED_ON_DARK;
  ctx.fillText("Décerné à", 78, 232);

  // Le nom s'arrête avant le médaillon (centré en W-190, cerclé à 102 de
  // rayon) : 40 px de dégagement, pour qu'un nom long ne vienne pas coller
  // au disque doré.
  const nameMaxWidth = W - 190 - 102 - 40 - 78;
  const nameSize = fitFont(ctx, data.name, fonts.display, "800", 66, 30, nameMaxWidth);
  ctx.font = `800 ${nameSize}px ${fonts.display}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(data.name, 78, 300);

  // Trait doré sous le nom — sa longueur suit celle du nom (avec un minimum,
  // pour qu'un prénom court garde un soulignement visible).
  const ruleWidth = Math.max(220, Math.min(ctx.measureText(data.name).width, nameMaxWidth));
  const rule = ctx.createLinearGradient(78, 0, 78 + ruleWidth, 0);
  rule.addColorStop(0, OR);
  rule.addColorStop(1, "rgba(242,183,5,0)");
  ctx.fillStyle = rule;
  ctx.fillRect(78, 322, ruleWidth, 4);

  // ---- Ce qui a été accompli
  ctx.font = `600 21px ${fonts.body}`;
  ctx.fillStyle = INK_ON_DARK;
  ctx.fillText(
    `pour avoir suivi et validé les ${data.modulesDone} modules du parcours`,
    78,
    374
  );
  ctx.font = `700 23px ${fonts.display}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("« De zéro à investisseur autonome à la BRVM »", 78, 410);

  // ---- Médaillon
  const cx = W - 190;
  const cy = 300;
  const medal = ctx.createLinearGradient(cx - 90, cy - 90, cx + 90, cy + 90);
  medal.addColorStop(0, OR_LIGHT);
  medal.addColorStop(1, OR);
  ctx.beginPath();
  ctx.arc(cx, cy, 88, 0, Math.PI * 2);
  ctx.fillStyle = medal;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 102, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(242,183,5,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.font = `78px ${fonts.body}`;
  ctx.fillText("💎", cx, cy + 28);
  ctx.textAlign = "left";

  // ---- Bandeau du bas : trois informations, séparées par des filets
  const baseY = 500;
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(78, baseY, W - 156, 1);

  const cells: { label: string; value: string }[] = [
    { label: "Délivré le", value: data.date },
    { label: "Statut atteint", value: data.statusLabel },
    { label: "Portefeuille final", value: `${data.capital} FCFA` },
  ];
  const cellWidth = (W - 156) / cells.length;
  cells.forEach((cell, i) => {
    const x = 78 + i * cellWidth;
    setLetterSpacing(ctx, "0.1em");
    ctx.font = `700 13px ${fonts.display}`;
    ctx.fillStyle = MUTED_ON_DARK;
    ctx.fillText(cell.label.toUpperCase(), x, baseY + 36);
    setLetterSpacing(ctx, "0em");
    ctx.font = `700 22px ${fonts.display}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(cell.value, x, baseY + 70);
    if (i > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(x - 24, baseY + 16, 1, 60);
    }
  });

  ctx.restore();
}

/** Prépare un canvas à la bonne résolution puis y dessine le certificat. */
export function paintCertificate(
  canvas: HTMLCanvasElement,
  data: CertificateData,
  fonts: CertificateFonts
) {
  canvas.width = CERT_WIDTH * SCALE;
  canvas.height = CERT_HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  drawCertificate(ctx, data, fonts);
}

export function certificateBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

/** Nom de fichier propre : « certificat-brvm-learning-awa-traore.png ». */
export function certificateFileName(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les accents laissés par NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `certificat-brvm-learning${slug ? `-${slug}` : ""}.png`;
}
