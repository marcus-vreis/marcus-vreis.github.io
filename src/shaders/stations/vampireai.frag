#version 300 es
precision highp float;

// VampireAI — "O Jogador Míope". A tela como um modelo pequeno a enxerga:
// scanlines de CRT, aberração cromática leve que cresce em direção às
// bordas, e uma vinheta discreta. Tudo é função só de `vUv` e `uEnter` — sem
// uniform de tempo, sem aleatoriedade — então nada pisca e nada glitcha.
// O projeto é sobre percepção limitada, não sobre estética glitch.

uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec3 uAccent;
uniform float uEnter;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float intensity = smoothstep(0.0, 1.0, clamp(uEnter, 0.0, 1.0));

  vec2 centered = vUv - 0.5;
  // Normaliza para ~1 no canto mais distante, 0 no centro.
  float radius = length(centered) * 1.41421356;

  // Aberração cromática: cresce com o quadrado da distância, então é
  // praticamente invisível perto do centro e só leve na borda. Coeficiente
  // baixo de propósito — em pixel art de bordas duras, mesmo um
  // deslocamento pequeno já fica bem visível.
  float shift = 0.0018 * radius * intensity;
  vec2 offset = centered * shift;
  float r = texture(uImage, vUv - offset).r;
  float g = texture(uImage, vUv).g;
  float b = texture(uImage, vUv + offset).b;
  vec3 color = vec3(r, g, b);

  // Scanlines de CRT: período fixo em pixels de tela — função só de
  // `gl_FragCoord.y`, nunca do tempo, então não piscam. Modulação rasa,
  // um traço, não um filtro.
  float scan = sin(gl_FragCoord.y * 3.14159265 / 1.6);
  color *= mix(1.0, 0.95 + 0.05 * scan, intensity);

  // Vinheta discreta: `falloff` vai de 0 no centro a 1 na borda; escurece
  // no máximo 16% lá fora, nunca um túnel escuro.
  float falloff = smoothstep(0.35, 0.95, radius);
  color *= mix(1.0, 1.0 - falloff * 0.16, intensity);

  // Um traço do acento do projeto nas sombras — a lente do observador,
  // quase subliminar.
  color += uAccent * 0.02 * intensity;

  fragColor = vec4(color, 1.0);
}
