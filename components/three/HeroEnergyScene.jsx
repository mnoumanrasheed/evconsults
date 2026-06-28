'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Trail, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ── Mouse tracking camera parallax ── */
function CameraRig({ mouse }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.current[0] * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.current[1] * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Dual DNA Helix particle flow ── */
function HelixParticles({ count = 600, radius = 2.5, speed = 0.3, color = '#00AEEF', offset = 0 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8 + offset;
      const spread = (Math.random() - 0.5) * 0.3;
      arr[i * 3]     = Math.cos(t) * (radius + spread);
      arr[i * 3 + 1] = (i / count - 0.5) * 14;
      arr[i * 3 + 2] = Math.sin(t) * (radius + spread);
    }
    return arr;
  }, [count, radius, offset]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * speed;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}

/* ── Ambient nebula cloud particles ── */
function NebulaCloud({ count = 1800 }) {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#00AEEF');
    const c2 = new THREE.Color('#39D353');
    const c3 = new THREE.Color('#7C3AED');
    for (let i = 0; i < count; i++) {
      // Sphere distribution
      const r = Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi) - 3;
      // Random color between the three palette colors
      const mix = Math.random();
      const chosen = mix < 0.5 ? c1.clone().lerp(c2, mix * 2) : c2.clone().lerp(c3, (mix - 0.5) * 2);
      col[i * 3]     = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.015;
    ref.current.rotation.x = Math.sin(t * 0.012) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

/* ── Rotating energy rings ── */
function EnergyRing({ radius, tubeRadius, color, speed, tiltX = 0, tiltZ = 0 }) {
  const ref = useRef();

  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(radius, tubeRadius, 8, 80);
  }, [radius, tubeRadius]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = tiltX + Math.sin(t * 0.3) * 0.05;
    ref.current.rotation.z = tiltZ;
    ref.current.material.opacity = 0.12 + 0.08 * Math.sin(t * 1.5);
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} wireframe />
    </mesh>
  );
}

/* ── Floating charging bolt node ── */
function ChargingNode({ position, color, pulseSeed = 0 }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() + pulseSeed;
    const s = 1 + 0.18 * Math.sin(t * 2.2);
    meshRef.current.scale.setScalar(s);
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.06 + 0.05 * Math.sin(t * 1.8);
      glowRef.current.scale.setScalar(1.5 + 0.3 * Math.sin(t * 1.2));
    }
  });

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      {/* Core node */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Electric arc connecting nodes ── */
function ElectricArc({ from, to, color, speed = 1 }) {
  const ref = useRef();

  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3(
        (from[0] + to[0]) / 2 + (Math.random() - 0.5) * 1.5,
        (from[1] + to[1]) / 2 + (Math.random() - 0.5) * 1.5,
        (from[2] + to[2]) / 2
      ),
      new THREE.Vector3(...to),
    ]);
    return curve.getPoints(30);
  }, []);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.opacity = 0.3 + 0.25 * Math.abs(Math.sin(t * speed * 3));
    // Flicker effect
    ref.current.material.opacity *= Math.random() > 0.95 ? 0.1 : 1;
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} linewidth={1} />
    </line>
  );
}

/* ── Horizontal scan lines ── */
function ScanLines() {
  const ref = useRef();
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 12; i++) {
      const y = (i / 12 - 0.5) * 14;
      vertices.push(-14, y, -2, 14, y, -2);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.opacity = 0.03 + 0.025 * Math.sin(t * 0.8);
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#00AEEF" transparent opacity={0.04} depthWrite={false} />
    </lineSegments>
  );
}

/* ── Main exported scene ── */
export default function HeroEnergyScene() {
  const mouse = useRef([0, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Charging node positions
  const nodes = [
    { pos: [-4.5, 1.5, -1], color: '#00AEEF', seed: 0 },
    { pos: [4.2, -1.8, -1.5], color: '#39D353', seed: 2 },
    { pos: [-2.5, -2.5, -0.5], color: '#7C3AED', seed: 4 },
    { pos: [3.0, 2.8, -2], color: '#00AEEF', seed: 1 },
    { pos: [0.5, -3.5, -1], color: '#39D353', seed: 3 },
    { pos: [-4.0, -0.5, -2.5], color: '#7C3AED', seed: 5 },
  ];

  // Arc connections between nodes
  const arcs = [
    { from: nodes[0].pos, to: nodes[3].pos, color: '#00AEEF', speed: 1.2 },
    { from: nodes[1].pos, to: nodes[4].pos, color: '#39D353', speed: 0.9 },
    { from: nodes[2].pos, to: nodes[5].pos, color: '#7C3AED', speed: 1.5 },
    { from: nodes[0].pos, to: nodes[2].pos, color: '#00AEEF', speed: 0.7 },
    { from: nodes[3].pos, to: nodes[1].pos, color: '#39D353', speed: 1.1 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 70 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        {/* Mouse-responsive camera parallax */}
        <CameraRig mouse={mouse} />

        {/* Nebula background cloud */}
        <NebulaCloud count={1600} />

        {/* Dual DNA helix strands */}
        <HelixParticles count={500} radius={2.8} speed={0.25} color="#00AEEF" offset={0} />
        <HelixParticles count={500} radius={2.8} speed={0.25} color="#39D353" offset={Math.PI} />

        {/* Rotating torus energy rings */}
        <EnergyRing radius={5.5} tubeRadius={0.018} color="#00AEEF" speed={0.18} tiltX={Math.PI / 3} tiltZ={0.2} />
        <EnergyRing radius={4.0} tubeRadius={0.014} color="#39D353" speed={-0.22} tiltX={Math.PI / 5} tiltZ={-0.4} />
        <EnergyRing radius={6.5} tubeRadius={0.012} color="#7C3AED" speed={0.12} tiltX={Math.PI / 7} tiltZ={0.6} />

        {/* Floating charging nodes */}
        {nodes.map((n, i) => (
          <ChargingNode key={i} position={n.pos} color={n.color} pulseSeed={n.seed} />
        ))}

        {/* Electric arcs between nodes */}
        {arcs.map((a, i) => (
          <ElectricArc key={i} from={a.from} to={a.to} color={a.color} speed={a.speed} />
        ))}

        {/* Subtle horizontal scan lines */}
        <ScanLines />
      </Canvas>
    </div>
  );
}
