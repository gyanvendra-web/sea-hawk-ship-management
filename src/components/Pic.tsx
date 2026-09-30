import Image from "next/image";
import type { Img } from "@/lib/images";
export default function Pic({ i, priority, sizes = "(max-width: 900px) 100vw, 1100px", style }: { i: Img; priority?: boolean; sizes?: string; style?: React.CSSProperties }) {
  return <Image src={i.src} width={i.w} height={i.h} alt={i.alt} priority={priority} sizes={sizes} unoptimized={i.src.endsWith(".svg")} style={{ width: "100%", height: "auto", display: "block", ...style }} />;
}
