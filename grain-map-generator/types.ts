
export type bezierPoint = {
  x: number;
  y: number;
};

export interface GrainEffectSettings {
  source: 'upload' | 'scratch';
  grainSize: number;
  threshold: number;
  jitter: number;
  gradientRotation: number;
  gradientDarkness: number;
  gradientP1: bezierPoint;
  gradientP2: bezierPoint;
  fileName: string;
  scale: number;
  addBackground: boolean;
  whiteAsMax: boolean;
}