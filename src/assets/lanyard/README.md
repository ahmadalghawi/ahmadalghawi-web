# Lanyard Assets

The `Lanyard` component needs **two asset files** to work. Download them from the React Bits repo:

🔗 **https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/Lanyard**

Place the two files in this folder:

```
src/assets/lanyard/
├── card.glb       ← the 3D ID-card model
└── lanyard.png    ← the fabric band texture
```

## Customizing the card

### Change the card face

1. Download `card.glb`
2. Open <https://modelviewer.dev/editor/>
3. Drag your `card.glb` in
4. Replace the `base` material's texture with your own image (name/photo/logo)
5. Export back to `.glb` and drop it here

### Change the lanyard band

Open `lanyard.png` in any image editor and repaint — it tiles along the band.

## Notes

- These files are **required at build time** — without them the home page will not render the 3D card.
- If you want to remove the Lanyard entirely, delete `Lanyard.tsx` and its reference from `src/components/sections/About.tsx`.
- Both files are served as static Vite assets (see `vite.config.ts` → `assetsInclude: ['**/*.glb']`).
