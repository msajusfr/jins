import type { ReactNode } from "react";

// Mapping Jin IDs to their brush stroke illustrations.
// All images are white-on-black PNGs rendered with mix-blend-mode: screen
// in the parent component, making the black background transparent.

const imageMap: Record<string, string> = {
  "mo-jin": "/images/jins/mo-jin.png",
  "mo-pan-jin": "/images/jins/mo-pan-jin.png",
  "chan-jin": "/images/jins/chan-jin.png",
  "chan-si-jin": "/images/jins/chan-si-jin.png",
  "luo-xuan-jin": "/images/jins/luo-xuan-jin.png",
  "zuan-jin": "/images/jins/zuan-jin.png",
  "guo-jin": "/images/jins/guo-jin.png",
  "rao-jin": "/images/jins/rao-jin.png",
  "xuan-jin": "/images/jins/xuan-jin.png",
  "zhan-jin": "/images/jins/zhan-jin.png",
  "nian-jin": "/images/jins/nian-jin-brush.png",
  "zhan-nian-jin": "/images/jins/zhan-nian-jin.png",
  "ting-jin": "/images/jins/ting-jin.png",
  "hua-jin": "/images/jins/hua-jin.png",
  "yin-jin": "/images/jins/yin-jin.png",
  "na-jin": "/images/jins/na-jin.png",
  "zhan-lian-jin": "/images/jins/zhan-lian-jin.png",
  "fa-jin": "/images/jins/fa-jin.png",
  "bao-jin": "/images/jins/bao-jin.png",
  "cun-jin": "/images/jins/cun-jin.png",
  "tou-jin": "/images/jins/tou-jin.png",
  "chong-jin": "/images/jins/chong-jin.png",
  "beng-jin": "/images/jins/beng-jin.png",
  "tan-jin": "/images/jins/tan-jin.png",
  "dou-jin": "/images/jins/dou-jin.png",
  "zha-jin": "/images/jins/zha-jin.png",
  "chen-jin": "/images/jins/chen-jin.png",
  "zhui-jin": "/images/jins/zhui-jin.png",
  "ya-jin": "/images/jins/ya-jin.png",
  "tun-jin": "/images/jins/tun-jin.png",
  "tun-tu-jin": "/images/jins/tun-tu-jin.png",
  "zheng-jin": "/images/jins/zheng-jin.png",
  "chang-jin": "/images/jins/chang-jin.png",
  "fang-jin": "/images/jins/fang-jin.png",
  "shen-jin": "/images/jins/shen-jin.png",
  "tong-jin": "/images/jins/tong-jin.png",
  "guan-jin": "/images/jins/guan-jin.png",
  "peng-jin": "/images/jins/peng-jin.png",
  "lu-jin": "/images/jins/lu-jin.png",
  "ji-jin": "/images/jins/ji-jin.png",
  "an-jin": "/images/jins/an-jin.png",
  "cai-jin": "/images/jins/cai-jin.png",
  "lie-jin": "/images/jins/lie-jin.png",
  "zhou-jin": "/images/jins/zhou-jin.png",
  "kao-jin": "/images/jins/kao-jin.png",
  "heng-jin": "/images/jins/heng-jin.png",
  "shu-jin": "/images/jins/shu-jin.png",
  "shi-zi-jin": "/images/jins/shi-zi-jin.png",
  "lie-jin-2": "/images/jins/lie-jin-2.png",
  "fan-lang-jin": "/images/jins/fan-lang-jin.png",
  "tie-jin": "/images/jins/tie-jin.png",
  "rou-jin": "/images/jins/rou-jin.png",
  "gang-jin": "/images/jins/gang-jin.png",
};

// Generic fallback stroke (simple diagonal brush line on transparent-black)
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
  const src = imageMap[jinId];
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
