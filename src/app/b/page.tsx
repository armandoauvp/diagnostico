import type { Metadata } from "next";
import { Diagnostico } from "@/components/Diagnostico";
import { conteudoB } from "@/conteudo/b";

export const metadata: Metadata = { title: conteudoB.marca.titulo, robots: { index: false } };

export default function PageB() {
  return <Diagnostico variante="b" />;
}
