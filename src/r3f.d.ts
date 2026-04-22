// Module augmentation — this file must be a module (hence `export {}`)
// for `declare module '@react-three/fiber'` to *extend* (not replace).
// Registers custom meshline elements with R3F so they can be used as JSX.
export {};

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: object;
    meshLineMaterial: object;
  }
}
