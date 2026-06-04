import type { ReactNode } from "react";
import { jinImages } from "../data/generated/jinImages.generated";

const fallbackStroke: ReactNode = (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-auto">
    <path
      d="M60 160 Q100 100, 140 60"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

type JinIllustrationProps = {
  jinId: string;
};

export function JinIllustration({ jinId }: JinIllustrationProps) {
  const src = jinImages[jinId];
  if (!src) {
    return <>{fallbackStroke}</>;
  }

  return (
    <img
      src={src}
      alt=""
      className="h-20 w-auto object-contain"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
