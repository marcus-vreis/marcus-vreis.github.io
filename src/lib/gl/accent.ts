// Converte o acento de um projeto (hex, já validado pelo schema de conteúdo
// em `content.config.ts`) para o vec3 0..1 que os shaders esperam no uniform
// `uAccent`. Puro — sem hex hardcoded aqui, só a conversão do que vem do
// frontmatter via DOM. O módulo fica pronto para os motores de chão/hero de
// planos futuros; nenhum componente o usa hoje.

/** Espera um hex de 6 dígitos com `#`, o mesmo formato de `accent`/
 *  `accentLight` no frontmatter dos MDX. */
export function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}
