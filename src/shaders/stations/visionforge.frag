#version 300 es
precision highp float;

// VisionForge — "O Instrumento". Uma grade de medição fina por cima da
// própria capa do projeto, e uma linha de leitura que varre a imagem uma
// vez, de cima a baixo, enquanto a estação entra — como um instrumento
// adquirindo uma leitura. Depois da varredura só resta a grade, quase
// imperceptível. Contido de propósito: isto é um instrumento de bancada,
// não uma demo de shader.

uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec3 uAccent;
uniform float uEnter;

in vec2 vUv;
out vec4 fragColor;

/** Linha de grade antisserrilhada por `fwidth`, independente de resolução. */
float gridLines(vec2 uv, vec2 resolution, float cellPx) {
  vec2 coord = uv * resolution / cellPx;
  vec2 dist = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), 1e-6);
  float line = min(dist.x, dist.y);
  return 1.0 - min(line, 1.0);
}

void main() {
  float enter = clamp(uEnter, 0.0, 1.0);
  vec3 base = texture(uImage, vUv).rgb;

  // A grade permanece o tempo todo — bem discreta, como a reticula de um
  // instrumento de bancada, não um overlay de depuração.
  float grid = gridLines(vUv, uResolution, 28.0);

  // A leitura varre de cima (vUv.y perto de 1) para baixo uma única vez,
  // acompanhando `uEnter`. `step(enter, 0.999)` desliga a linha assim que a
  // entrada termina — nada de rastro permanente.
  float sweepY = mix(1.06, -0.06, enter);
  float sweepDist = abs(vUv.y - sweepY);
  float sweepCore = smoothstep(0.010, 0.0, sweepDist);
  float sweepGlow = smoothstep(0.05, 0.0, sweepDist);
  float sweep = (sweepCore * 0.8 + sweepGlow * 0.2) * step(enter, 0.999);

  vec3 color = base;
  color += uAccent * grid * 0.05;
  color += uAccent * sweep * 0.5;

  fragColor = vec4(color, 1.0);
}
