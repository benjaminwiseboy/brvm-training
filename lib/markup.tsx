import React from "react";
import { splitMarkup } from "./format";

export function renderMarkup(input: string): React.ReactNode {
  return splitMarkup(input).map((seg, i) =>
    seg.bold ? <strong key={i}>{seg.text}</strong> : <React.Fragment key={i}>{seg.text}</React.Fragment>,
  );
}
