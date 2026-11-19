import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { CanvasTexture, Color, Group, Mesh, MeshStandardMaterial, SRGBColorSpace } from 'three';
import phone from '@/assets/models/smartphone.glb.asset.json';
import headphones from '@/assets/models/headphones.glb.asset.json';
import type { visualPolicy } from '@/lib/visual-policy';

type Props = { kind: 'phone' | 'repair' | 'headphones'; policy: ReturnType<typeof visualPolicy> };
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
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
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
            drawing.fillStyle = styles.getPropertyValue('--phone-glass').trim(); drawing.fillRect(0, 0, 256, 512);
            drawing.fillStyle = styles.getPropertyValue('--primary').trim(); drawing.textAlign = 'center'; drawing.font = 'bold 68px sans-serif'; drawing.fillText('MW', 128, 258);
            drawing.fillStyle = styles.getPropertyValue('--foreground').trim(); drawing.font = 'bold 15px sans-serif'; drawing.fillText('MOBILE WORLD', 128, 290);
            const texture = new CanvasTexture(display); texture.colorSpace = SRGBColorSpace;
            const screen = object.material.clone(); screen.color.setRGB(1, 1, 1); screen.map = texture;
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