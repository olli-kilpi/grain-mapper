export function exportPng(
  source: HTMLCanvasElement,
  options: { fileName: string; scale: number; addBackground: boolean },
) {
  const scale = Number.isFinite(options.scale) && options.scale > 0 ? options.scale : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;
  if (options.addBackground) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  const name = options.fileName.endsWith('.png') ? options.fileName : `${options.fileName || 'grain_output'}.png`;
  const link = document.createElement('a');
  link.download = name;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
