#version 300 es
precision highp float;

uniform sampler2D uImage;
uniform vec2 uResolution;
uniform float uProgress;
uniform vec2 uPointer;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);

  // O bloco do sensor encolhe de 12px para 1px.
  float block = mix(12.0, 1.0, smoothstep(0.0, 0.85, p));
  vec2 px = gl_FragCoord.xy;
  vec2 snapped = (floor(px / block) + 0.5) * block;
  vec3 full = texture(uImage, snapped / uResolution).rgb;

  // Máscara de Bayer RGGB sobre a grade de blocos.
  vec2 cell = mod(floor(px / block), 2.0);
  vec3 mask = cell.x < 1.0
    ? (cell.y < 1.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0))
    : (cell.y < 1.0 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0));

  // Um canal por fotossítio: multiplica por 3 para o brilho não desabar.
  vec3 raw = full * mask * 3.0;

  // Ruído de leitura, some junto com o mosaico. Baixo o bastante para não
  // afogar o padrão RGGB por trás dele.
  raw += (hash(floor(px / block)) - 0.5) * 0.14 * (1.0 - p);

  vec3 color = mix(raw, full, smoothstep(0.30, 1.0, p));

  // O cursor é a fonte de luz: um realce âmbar discreto.
  if (uPointer.x >= 0.0) {
    float d = distance(gl_FragCoord.xy / uResolution, uPointer);
    color += vec3(0.16, 0.10, 0.03) * smoothstep(0.55, 0.0, d) * p;
  }

  fragColor = vec4(color, 1.0);
}
