# Hero logo model

Source: user-supplied `mtcc logo.glb` (58,934,744 bytes).
Source SHA-256: `4362f2f12dcfdd4dffb664d39607894c53909ceb1b10904656bb4c1a539221d3`.

Web asset: `public/models/mtcc-logo.glb` (3,458,772 bytes).
SHA-256: `865e3d2132d6fce9577e76f6e7458e99a72f38c087e6fd9e738bca8014a80563`.

Prepared with Blender 5.2.2: import original glTF, apply a collapse Decimate
modifier with ratio 0.025, resize each 4096px texture to 2048px, export GLB
with tangents. Original source remains unchanged. No generated replacement
geometry or imagery is used.

Inspection: 48,333 triangles (original 1,933,392), one mesh/material,
three textures, UVs, normals and tangents. `game-dev asset inspect` reports
no warnings. The hero loads the local asset through the site's base path.
Rendering pauses offscreen and in hidden tabs; reduced motion is static.
