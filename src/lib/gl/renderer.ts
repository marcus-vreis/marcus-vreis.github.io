// Contexto WebGL2, quad em tela cheia, um par de shaders, uniforms. Não sabe
// nada sobre Bayer nem sobre o site — recebe um canvas, o fragment shader e a
// imagem, devolve um handle ou `null` se o navegador não conseguir.

import quadVertexSource from '../../shaders/quad.vert?raw';

/**
 * Uniforms que um shader pode consumir. Nenhum é obrigatório: um shader que
 * não declara um destes uniforms simplesmente recebe `getUniformLocation ===
 * null` para ele, e `gl.uniform*` com localização nula é um no-op silencioso
 * pela própria spec do WebGL — por isso o renderer pode sempre tentar setar
 * os quatro sem saber quais o fragment shader ligado realmente usa.
 */
export interface DrawUniforms {
  /** Progresso 0→1 de um efeito guiado por tempo, como a abertura. */
  progress?: number;
  /** Posição do ponteiro em uv [0,1], ou [-1,-1] quando fora da área. */
  pointer?: [number, number];
  /** Cor de acento do projeto, já normalizada 0..1 por canal. */
  accent?: [number, number, number];
  /** Progresso 0→1 de entrada da estação na viewport. */
  enter?: number;
}

export interface Renderer {
  /** Redimensiona o buffer ao tamanho de exibição. Idempotente. */
  resize(): void;
  /** Desenha um quadro com os uniforms dados. */
  draw(uniforms: DrawUniforms): void;
  /** Libera contexto, texturas e programa. */
  dispose(): void;
}

/** Acima disso o custo de pixels sobe sem ganho visível. */
const MAX_DEVICE_PIXEL_RATIO = 2;

// Dois triângulos cobrindo o clip space inteiro. Sem index buffer.
// prettier-ignore
const QUAD_VERTICES = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
]);

/**
 * Alguns navegadores recusam ou corrompem `texImage2D` a partir de uma
 * `<img>` de SVG direto — o vetor ainda não foi rasterizado num bitmap no
 * instante em que a textura é montada, mesmo depois de `img.decode()`
 * resolver (visto na prática: `INVALID_VALUE: texImage2D: bad image data`,
 * de forma intermitente). Repassar por um canvas 2D força a rasterização
 * antes da textura, o que é confiável tanto para SVG quanto para raster —
 * por isso vale para qualquer imagem, não só para o placeholder.
 */
function rasterize(image: HTMLImageElement): HTMLCanvasElement | null {
  const attrWidth = Number(image.getAttribute('width'));
  const attrHeight = Number(image.getAttribute('height'));
  const width = attrWidth > 0 ? attrWidth : image.naturalWidth || image.width;
  const height = attrHeight > 0 ? attrHeight : image.naturalHeight || image.height;
  if (!width || !height) return null;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  fragmentSource: string,
  image: HTMLImageElement,
): Renderer | null {
  try {
    const gl2 = canvas.getContext('webgl2');
    if (!gl2) return null;
    // Alias com tipo não-nulo explícito: a análise de fluxo do TS não
    // propaga o `if` acima para dentro das closures declaradas abaixo.
    const gl: WebGL2RenderingContext = gl2;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, quadVertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');

    const raster = rasterize(image);
    if (!raster) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      return null;
    }

    const texture = gl.createTexture();
    if (!texture) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      return null;
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, raster);

    // Localizações guardadas uma vez — nunca consultadas por quadro. Um
    // shader que não declara um destes uniforms rende `null` aqui, e os
    // `gl.uniform*` correspondentes em `draw()` viram no-op.
    const uniformLocations = {
      uImage: gl.getUniformLocation(program, 'uImage'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uProgress: gl.getUniformLocation(program, 'uProgress'),
      uPointer: gl.getUniformLocation(program, 'uPointer'),
      uAccent: gl.getUniformLocation(program, 'uAccent'),
      uEnter: gl.getUniformLocation(program, 'uEnter'),
    };

    let width = 0;
    let height = 0;

    function resize(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      const displayWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const displayHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (displayWidth === width && displayHeight === height) return;
      width = displayWidth;
      height = displayHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    function draw(uniforms: DrawUniforms): void {
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const pointer = uniforms.pointer ?? [-1, -1];
      const accent = uniforms.accent ?? [1, 1, 1];

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniformLocations.uImage, 0);
      gl.uniform2f(uniformLocations.uResolution, width, height);
      gl.uniform1f(uniformLocations.uProgress, uniforms.progress ?? 0);
      gl.uniform2f(uniformLocations.uPointer, pointer[0], pointer[1]);
      gl.uniform3f(uniformLocations.uAccent, accent[0], accent[1], accent[2]);
      gl.uniform1f(uniformLocations.uEnter, uniforms.enter ?? 1);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function dispose(): void {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    resize();

    return { resize, draw, dispose };
  } catch (error) {
    console.error(error);
    return null;
  }
}
