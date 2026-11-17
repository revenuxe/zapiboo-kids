import { Children, isValidElement, type ReactNode } from "react";

function plainText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (!isValidElement<{ children?: ReactNode }>(child)) return "";
      return child.type === "br" ? " " : plainText(child.props.children);
    })
    .join("");
}

function highlightedText(node: ReactNode): string {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue;
    if (child.type === "span") return plainText(child.props.children).trim();
    const nested = highlightedText(child.props.children);
    if (nested) return nested;
  }
  return "";
}

export function HeadingText({ children }: { children: ReactNode }) {
  const text = plainText(children).replace(/\s+/g, " ").trim();
  const highlighted = highlightedText(children);
  let split = highlighted && text.endsWith(highlighted) ? text.length - highlighted.length : -1;
  if (split < 1) {
    const separator = text.includes(" & ") ? " & " : text.includes(" in ") ? " in " : "";
    split = separator ? text.indexOf(separator) : -1;
  }
  if (split < 1) {
    const words = text.split(" ");
    split = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(" ").length : 0;
  }
  return (
    <>
      {split > 0 && <span className="heading-lead">{text.slice(0, split).trim()} </span>}
      <span className="heading-accent">
        {text.slice(split).trim()}
        <svg viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 14 Q180 -5 394 10" />
        </svg>
      </span>
    </>
  );
}
