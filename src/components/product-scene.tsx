import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { CanvasTexture, Color, Group, Mesh, MeshStandardMaterial, SRGBColorSpace } from 'three';
import phone from '@/assets/models/smartphone.glb.asset.json';
import headphones from '@/assets/models/headphones.glb.asset.json';
import type { visualPolicy } from '@/lib/visual-policy';

type Props = { kind: 'phone' | 'repair' | 'headphones'; policy: ReturnType<typeof visualPolicy> };

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPhoneScreen(ctx: CanvasRenderingContext2D) {
  const W = 256, H = 512;

  // Wallpaper — deep multi-stop gradient
  const wp = ctx.createLinearGradient(0, 0, W * 0.35, H);
  wp.addColorStop(0, '#0b0b1a');
  wp.addColorStop(0.35, '#121828');
  wp.addColorStop(0.7, '#0d1118');
  wp.addColorStop(1, '#070910');
  ctx.fillStyle = wp;
  ctx.fillRect(0, 0, W, H);

  // Ambient colour blobs
  ctx.fillStyle = 'rgba(100,130,255,0.05)';
  ctx.beginPath(); ctx.arc(55, 95, 75, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(60,200,170,0.035)';
  ctx.beginPath(); ctx.arc(205, 360, 55, 0, Math.PI * 2); ctx.fill();

  // Status bar
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('9:41', 14, 19);
  // Signal bars
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  for (let i = 0; i < 4; i++) ctx.fillRect(196 + i * 4, 16 - i * 2, 2.5, 3 + i * 2);
  // Battery outline
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
  ctx.strokeRect(218, 13, 18, 8);
  // Battery fill
  ctx.fillStyle = 'rgba(110,200,100,0.75)';
  ctx.fillRect(219, 14, 15, 6);
  ctx.fillRect(236, 15, 1.5, 4);

  // Clock widget
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '700 36px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('9:41', W / 2, 70);
  ctx.font = '400 10px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('Monday · 19 November', W / 2, 87);

  // Weather card
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  rr(ctx, 16, 106, 224, 44, 12); ctx.fill();
  // Sun
  ctx.fillStyle = 'rgba(255,200,60,0.8)';
  ctx.beginPath(); ctx.arc(40, 128, 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,200,60,0.4)'; ctx.lineWidth = 1.5;
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(40 + Math.cos(ang) * 11, 128 + Math.sin(ang) * 11);
    ctx.lineTo(40 + Math.cos(ang) * 14, 128 + Math.sin(ang) * 14);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('24°', 60, 126);
  ctx.font = '400 9px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.fillText('Surat · Mostly Clear', 60, 140);

  // App grid — 4 columns × 3 rows
  const apps = [
    '#34c759', '#007aff', '#ff3b30', '#ff9500',
    '#af52de', '#5ac8fa', '#ffcc00', '#ff2d55',
    '#5856d6', '#30b0c7', '#ff6482', '#4cd964',
  ];
  const is = 34, gap = 18, cols = 4;
  const gridW = cols * is + (cols - 1) * gap;
  const sx = (W - gridW) / 2;
  for (let i = 0; i < apps.length; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = sx + c * (is + gap);
    const y = 170 + r * (is + gap + 14);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    rr(ctx, x + 1, y + 2, is, is, 8); ctx.fill();
    // Icon base
    ctx.fillStyle = apps[i];
    rr(ctx, x, y, is, is, 8); ctx.fill();
    // Gloss gradient
    const g = ctx.createLinearGradient(x, y, x, y + is);
    g.addColorStop(0, 'rgba(255,255,255,0.22)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.03)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    rr(ctx, x, y, is, is, 8); ctx.fill();
  }

  // Dock
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  rr(ctx, 14, 425, 228, 56, 18); ctx.fill();
  const dock = ['#1da1f2', '#25d366', '#7c3aed', '#ff4500'];
  const ds = 38, dg = 22;
  const dx = (W - (4 * ds + 3 * dg)) / 2;
  for (let i = 0; i < 4; i++) {
    const x = dx + i * (ds + dg);
    ctx.fillStyle = dock[i];
    rr(ctx, x, 434, ds, ds, 10); ctx.fill();
    const g = ctx.createLinearGradient(x, 434, x, 434 + ds);
    g.addColorStop(0, 'rgba(255,255,255,0.25)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    rr(ctx, x, 434, ds, ds, 10); ctx.fill();
  }

  // Home indicator
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  rr(ctx, 100, 498, 56, 3, 1.5); ctx.fill();
}

function Model({ kind, policy }: Props) {
  const { scene } = useGLTF(kind === 'headphones' ? headphones.url : phone.url);
  const root = useRef<Group>(null);
  const clock = useRef(0);
  const { clone, parts } = useMemo(() => {
    const clone = scene.clone(true);
    const styles = getComputedStyle(document.documentElement);
    const swatch = document.createElement('canvas');
    swatch.width = swatch.height = 1;
    const context = swatch.getContext('2d', { willReadFrequently: true });
    const tokenColor = (name: string) => {
      if (!context) return new Color();
      context.fillStyle = styles.getPropertyValue(`--${name}`).trim() || styles.getPropertyValue('--foreground').trim();
      context.fillRect(0, 0, 1, 1);
      const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;
      return new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
    };
    const parts: { object: Group | Mesh; z: number; name: string }[] = [];
    clone.traverse((object) => {
      if (object instanceof Mesh && object.material instanceof MeshStandardMaterial) {
        object.material = object.material.clone();
        object.material.color = tokenColor(object.material.name);
        if (object.name === 'Screen') {
          const display = document.createElement('canvas');
          display.width = 256; display.height = 512;
          const drawing = display.getContext('2d');
          if (drawing) {
            drawPhoneScreen(drawing);
            const texture = new CanvasTexture(display); texture.colorSpace = SRGBColorSpace;
            const screen = object.material.clone(); screen.color.setRGB(1, 1, 1); screen.map = texture;
            screen.emissive = new Color(0xffffff); screen.emissiveMap = texture; screen.emissiveIntensity = 0.45;
            const edges = object.material.clone();
            object.material = [screen, edges];
          }
        }
      }
      if (object.name === 'Logo') object.visible = false;
    });
    clone.children.forEach(object => {
      if (object instanceof Group || object instanceof Mesh) parts.push({ object, z: object.position.z, name: object.name });
    });
    return { clone, parts };
  }, [scene]);
  useFrame((_, delta) => {
    if (!root.current) return;
    clock.current += Math.min(delta, 0.05) * policy.speed;
    const t = clock.current;
    root.current.rotation.set(Math.sin(t * 0.7) * 0.1, Math.sin(t) * (policy.mobile ? 0.17 : 0.4), Math.sin(t * 0.6) * 0.1 - 0.12);
    if (kind === 'repair') {
      const spread = policy.animate ? Math.pow((Math.sin(t * 1.5) + 1) / 2, 2) : 0.6;
      for (const part of parts) {
        const offset = ['Screen', 'Logo', 'Earpiece'].includes(part.name) ? 0.7 : part.name === 'Back' ? -0.75 : part.name.startsWith('Lens') ? -0.75 : part.name === 'Battery' ? -0.4 : part.name === 'Circuit' ? -0.2 : 0;
        part.object.position.z = part.z + spread * offset;
      }
    }
    const canvas = document.querySelector(`[data-product-kind="${kind}"]`);
    if (canvas && !canvas.hasAttribute('data-scene-ready')) canvas.setAttribute('data-scene-ready', 'true');
  });
  return <group ref={root} rotation={[0.08, kind === 'repair' ? 0.5 : 0.15, -0.12]} position={[0, kind === 'headphones' ? -0.15 : 0, 0]}><primitive object={clone} /></group>;
}
export default function ProductScene(props: Props) {
  return <Canvas dpr={props.policy.dpr} frameloop={props.policy.animate ? 'always' : 'demand'} camera={{ position: [0, 0, 6.3], fov: 35 }} gl={{ antialias: !props.policy.mobile, alpha: true }}>
    <ambientLight intensity={1.1} />
    <directionalLight position={[3, 4, 5]} intensity={2.5} />
    <Environment resolution={64}><Lightformer intensity={3} position={[0, 3, 4]} scale={[6, 2, 1]} /><Lightformer intensity={2} position={[-3, 0, 2]} scale={[2, 5, 1]} /></Environment>
    <Suspense fallback={null}><Model {...props} /></Suspense>
    {props.policy.interactive && props.kind !== 'phone' && <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI * 2 / 3} minAzimuthAngle={-0.7} maxAzimuthAngle={0.7} />}
  </Canvas>;
}
