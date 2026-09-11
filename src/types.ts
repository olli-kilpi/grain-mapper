export type BezierPoint = {
  x: number;
  y: number;
};

export interface GrainEffectSettings {
  source: 'upload' | 'scratch';
  grainSize: number;
  threshold: number;
  jitter: number;
  seed: number;
  gradientRotation: number;
  gradientDarkness: number;
  gradientP1: BezierPoint;
  gradientP2: BezierPoint;
  fileName: string;
  scale: number;
  addBackground: boolean;
  whiteAsMax: boolean;
}
