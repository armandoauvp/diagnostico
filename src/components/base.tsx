"use client";

import { useEffect, useRef, useState } from "react";

/** Texto com HTML simples (<b>, <em>, <i>) vindo de src/conteudo. Nunca recebe entrada do usuário sem escHtml. */
export function Rich({ html, as: Tag = "span", className }: { html: string; as?: "span" | "p" | "div"; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function useReduzMovimento() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}

/** Sobe de 0 até o alvo com easing (0,9 s, como na v6). */
export function useContagem(alvo: number, ativo = true, ms = 900) {
  const [v, setV] = useState(0);
  const reduz = useReduzMovimento();
  useEffect(() => {
    if (!ativo) return;
    if (reduz) {
      setV(alvo);
      return;
    }
    let raf = 0;
    let t0: number | null = null;
    const f = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / ms);
      setV(alvo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [alvo, ativo, ms, reduz]);
  return v;
}

/** Marca o elemento como visto quando entra na tela (uma vez). */
export function useVisto<T extends Element>(margem = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visto) return;
    if (!("IntersectionObserver" in window)) {
      setVisto(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setVisto(true);
          io.disconnect();
        }
      },
      { rootMargin: margem, threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margem, visto]);
  return [ref, visto] as const;
}
