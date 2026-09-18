"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "../../lib/asset-path";

export function HeroLogo() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current!;
    let disposed = false;
    let cleanup = () => {};
    async function initialize() {
      const [THREE, { GLTFLoader }] = await Promise.all([
        import("three"), import("three/addons/loaders/GLTFLoader.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 20);
      const group = new THREE.Group();
      scene.add(group, new THREE.HemisphereLight(0xe9faff, 0x516e90, 3));
      const light = new THREE.DirectionalLight(0xffffff, 4);
      light.position.set(-2, 3, 4);
      scene.add(light);
      const rim = new THREE.DirectionalLight(0x7bdfff, 3);
      rim.position.set(2, 1, -2);
      scene.add(rim);
      let frame = 0;
      let visible = false;
      let progress = 0;
      let target = 0;
      let loaded = false;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const disposeModel = (root: import("three").Object3D) => {
        const textures = new Set<import("three").Texture>();
        root.traverse(node => {
          if (!(node instanceof THREE.Mesh)) return;
          node.geometry.dispose();
          for (const material of [node.material].flat()) {
            for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
            material.dispose();
          }
        });
        textures.forEach(texture => texture.dispose());
      };
      const draw = () => {
        frame = 0;
        if (disposed || !visible || !loaded || document.hidden) return;
        progress = reduced.matches ? 0.5 : progress + (target - progress) * 0.09;
        const mobile = element.clientWidth < 700;
        group.rotation.set((progress - 0.5) * 0.15, (progress - 0.5) * (mobile ? 0.5 : 0.85), (0.5 - progress) * 0.045);
        group.scale.setScalar(0.92 + progress * 0.12);
        light.position.x = -3 + progress * 6;
        renderer.render(scene, camera);
        if (!reduced.matches && Math.abs(target - progress) > 0.001) frame = requestAnimationFrame(draw);
      };
      const requestDraw = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
      const onScroll = () => {
        const rect = element.getBoundingClientRect();
        target = THREE.MathUtils.clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
        requestDraw();
      };
      const resize = () => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.set(0, 0, Math.max(1.8, 1.15 / (2 * Math.tan(THREE.MathUtils.degToRad(16)) * camera.aspect)));
        camera.updateProjectionMatrix();
        onScroll();
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; onScroll(); });
      const sizeObserver = new ResizeObserver(resize);
      const onContextLost = (event: Event) => { event.preventDefault(); setReady(false); };
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);
      element.appendChild(renderer.domElement);
      observer.observe(element);
      sizeObserver.observe(element);
      window.addEventListener("scroll", onScroll, { passive: true });
      reduced.addEventListener("change", requestDraw);
      document.addEventListener("visibilitychange", requestDraw);
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect(); sizeObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        reduced.removeEventListener("change", requestDraw);
        document.removeEventListener("visibilitychange", requestDraw);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        disposeModel(group);
        renderer.dispose(); renderer.domElement.remove();
      };
      resize();
      const gltf = await new GLTFLoader().loadAsync(assetPath("/models/mtcc-logo.glb"));
      if (disposed) { disposeModel(gltf.scene); return; }
      const bounds = new THREE.Box3().setFromObject(gltf.scene);
      gltf.scene.position.sub(bounds.getCenter(new THREE.Vector3()));
      group.add(gltf.scene);
      loaded = true;
      setReady(true);
      requestDraw();
    }
    initialize().catch(() => { if (!disposed) { cleanup(); setReady(false); } });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className={`hero-logo ${ready ? "is-ready" : ""}`} role="img" aria-label="MTCC three-dimensional logo">
    {/* The brand remains visible while the model loads or if WebGL is unavailable. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="hero-logo-fallback" src={assetPath("/assets/mtcc-logo.png")} alt="" />
    <div className="hero-logo-canvas" ref={host} aria-hidden="true" />
  </div>;
}
