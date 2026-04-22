/// <reference types="vite/client" />

// NOTE: no top-level import/export — keep this file a script
// so `declare module '*.ext'` wildcards are globally ambient.

// ── Vite asset imports ───────────────────────────────────────────
declare module '*.glb';
declare module '*.gltf';

// ── meshline doesn't ship types ─────────────────────────────────
declare module 'meshline' {
  export class MeshLineGeometry {
    setPoints(points: Array<{ x: number; y: number; z: number }>): void;
  }
  export class MeshLineMaterial {
    constructor(parameters?: unknown);
  }
}
