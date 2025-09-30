
import { GrainEffectSettings } from "./types";

export const DEFAULT_SETTINGS: GrainEffectSettings = {
  source: 'scratch',
  grainSize: 1,
  threshold: 0,
  jitter: 0,
  gradientRotation: 0,
  gradientDarkness: 1.0,
  gradientP1: { x: 0.25, y: 0.25 },
  gradientP2: { x: 0.75, y: 0.75 },
  fileName: "grain_output.png",
  scale: 1,
  addBackground: false,
  whiteAsMax: false,
};