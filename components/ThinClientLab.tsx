"use client";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Expand, Eye, Rotate3D, RotateCcw, ScanSearch, X } from "lucide-react";
import * as THREE from "three";
import { productSpecs } from "../data/productSpecs";
type K =
  | "shell"
  | "front"
  | "board"
  | "cpu"
  | "memory"
  | "storage"
  | "rear"
  | "power"
  | "cooling"
  | "stand"
  | "base"
  | "display"
  | "drawer";
type Product = {
  id: string;
  name: string;
  kind: string;
  photos: string[];
  parts: K[];
  structural?: boolean;
  copy: string;
  info: Partial<Record<K, [string, string, string]>>;
};
const products: Product[] = [
  {
    id: "thin",
    name: "Thin Client",
    kind: "VERTICAL MANAGED ENDPOINT",
    photos: [
      "/legacy/thin-clients/1.jpg",
      "/legacy/thin-clients/2.jpg",
      "/legacy/thin-clients/3.jpg",
    ],
    parts: [
      "front",
      "shell",
      "cooling",
      "board",
      "cpu",
      "memory",
      "storage",
      "rear",
      "power",
    ],
    copy: "Tall slim endpoint with green front trim, direct access ports and rear enterprise connectivity.",
    info: {
      front: [
        "Front fascia & green trim",
        "Direct access to USB and audio peripherals for user workstations.",
        "Power, USB Type-A, audio",
      ],
      shell: [
        "Slim chassis & ventilation",
        "Protects hardware and supports reliable thermal operation.",
        "Side and top ventilation",
      ],
      cooling: [
        "Ventilation channel",
        "Moves heat away through the vertical enclosure.",
        "Airflow path",
      ],
      board: [
        "Vertical mainboard",
        "Coordinates processor, memory, storage and device connectivity.",
        "Compact vertical board",
      ],
      cpu: [
        "Processor",
        "Runs the operating environment and remote desktop workload.",
        "Processor module",
      ],
      memory: [
        "SO-DIMM memory",
        "Supports responsive multitasking and virtual desktop sessions.",
        "SO-DIMM",
      ],
      storage: [
        "M.2 storage",
        "Holds operating system and configurations where required.",
        "M.2",
      ],
      rear: [
        "Rear I/O board",
        "Connects office, education, control-room and kiosk deployments.",
        "LAN, VGA, HDMI, USB, audio",
      ],
      power: [
        "DC power input",
        "Supplies regulated power for continuous operation.",
        "DC input",
      ],
    },
  },
  {
    id: "mini",
    name: "Mini PC",
    kind: "COMPACT DESKTOP COMPUTER",
    photos: [
      "/legacy/mini-pc/1.jpg",
      "/legacy/mini-pc/2.jpg",
      "/legacy/mini-pc/3.jpg",
    ],
    parts: [
      "shell",
      "cooling",
      "board",
      "cpu",
      "memory",
      "storage",
      "rear",
      "power",
    ],
    copy: "Low rounded Mini PC with a top ventilation grille, front controls and compact I/O.",
    info: {
      shell: [
        "Rounded shell",
        "Low horizontal chassis with top ventilation.",
        "Top grille",
      ],
      cooling: [
        "Thermal plate",
        "Supports compact thermal operation.",
        "Thermal path",
      ],
      board: [
        "Compact mainboard",
        "Coordinates internal device connectivity.",
        "Internal I/O",
      ],
      cpu: ["Processor", "Runs computing workloads.", "Processor"],
      memory: ["SO-DIMM RAM", "Supports active sessions.", "SO-DIMM"],
      storage: [
        "NVMe storage",
        "Provides responsive system storage.",
        "M.2 NVMe",
      ],
      rear: [
        "Rear I/O",
        "Supported display and network connections.",
        "Display / network I/O",
      ],
      power: ["Power input", "Feeds the compact system.", "DC input"],
    },
  },
  {
    id: "stick",
    name: "Compute Stick",
    kind: "HDMI COMPUTE MODULE",
    photos: ["/exploded/monitor-stick.png", "/showcase/complete-system.png"],
    parts: ["shell", "rear", "board", "cpu", "memory", "storage", "power"],
    copy: "Slim black HDMI compute module with compact integrated architecture.",
    info: {
      shell: [
        "Outer shell",
        "Protects the compact compute-stick format.",
        "Slim body",
      ],
      rear: ["HDMI connector", "Direct display connection.", "HDMI male"],
      board: [
        "Logic board",
        "Coordinates embedded functions.",
        "Embedded board",
      ],
      cpu: ["Processor module", "Runs the compact PC workload.", "Processor"],
      memory: [
        "Memory package",
        "Supports the operating environment.",
        "Integrated memory",
      ],
      storage: [
        "Storage package",
        "Stores operating system and configuration.",
        "Embedded storage",
      ],
      power: ["Power management", "Regulates device power.", "Power section"],
    },
  },
  {
    id: "tower",
    name: "Tower Desktop",
    kind: "ENTERPRISE TOWER WORKSTATION",
    photos: [
      "/legacy/tower-desktop/1.jpg",
      "/legacy/tower-desktop/2.jpg",
      "/legacy/tower-desktop/4.jpg",
    ],
    parts: [
      "shell",
      "front",
      "cooling",
      "board",
      "cpu",
      "memory",
      "storage",
      "rear",
      "power",
    ],
    copy: "Black enterprise tower with lower-front branding, front I/O and serviceable airflow.",
    info: {
      shell: [
        "Side panel & tower shell",
        "Protects components and forms the service access path.",
        "Ventilated side panel",
      ],
      front: [
        "Front I/O",
        "Provides power and peripheral access.",
        "Power, USB, audio",
      ],
      cooling: [
        "Case airflow",
        "Moves air through the tower.",
        "Case fan path",
      ],
      board: [
        "Desktop mainboard",
        "Main platform for workstation components.",
        "Expansion capable",
      ],
      cpu: ["CPU & cooler", "Processes desktop workloads.", "CPU cooler"],
      memory: [
        "Desktop memory",
        "Supports applications and multitasking.",
        "DIMM",
      ],
      storage: ["Storage bay", "Holds configured storage.", "SSD / HDD bay"],
      rear: [
        "Rear I/O",
        "Connects peripherals and display paths.",
        "I/O, configurable slot",
      ],
      power: ["Power supply", "Supplies regulated system power.", "PSU"],
    },
  },
  {
    id: "monitor",
    name: "Monitor System",
    kind: "MONITOR + COMPUTE STICK",
    photos: [
      "/legacy/all-in-one/1.jpg",
      "/exploded/monitor-stick.png",
      "/legacy/all-in-one/3.jpg",
    ],
    parts: ["display", "rear", "stand", "base", "shell"],
    copy: "Slim monitor system with VESA mounting area, stand and compute-stick context.",
    info: {
      display: [
        "Display panel",
        "Primary viewing surface for the workstation.",
        "Display panel",
      ],
      rear: [
        "VESA mount & display I/O",
        "Provides mounting and supported signal paths.",
        "VESA plate / I/O",
      ],
      stand: [
        "Stand & cable management",
        "Supports ergonomic placement.",
        "Stand neck",
      ],
      base: ["Monitor base", "Provides stable support.", "Base"],
      shell: [
        "Compute stick",
        "Adds a compact PC module behind the display.",
        "HDMI compute stick",
      ],
    },
  },
  {
    id: "kiosk",
    name: "Interactive Kiosk",
    kind: "PUBLIC INFORMATION KIOSK",
    photos: [
      "/showcase/interactive-kiosk.png",
      "/legacy/kiosks-display/1.jpg",
      "/exploded/interactive-kiosk.png",
    ],
    parts: ["display", "front", "board", "rear", "stand", "base"],
    structural: true,
    copy: "White portrait kiosk with a tilted touch display, service access, pedestal and wheeled base.",
    info: {
      display: [
        "Touch display module",
        "Responsive public-facing interaction surface.",
        "Touch display",
      ],
      front: [
        "Front bezel",
        "Frames and protects the touch display.",
        "Metal bezel",
      ],
      board: [
        "Mini PC compartment",
        "Runs approved kiosk content and services.",
        "Mini PC space",
      ],
      rear: [
        "Service access panel",
        "Supports maintained access and cable routing.",
        "Access panel",
      ],
      stand: [
        "Pedestal channel",
        "Routes the internal structural path below the display.",
        "Pedestal",
      ],
      base: [
        "Wheeled base",
        "Supports stable mobile positioning.",
        "Lockable casters",
      ],
    },
  },
  {
    id: "cart",
    name: "Mobile Cart",
    kind: "MOBILE COMPUTING WORKSTATION",
    photos: ["/exploded/mobile-stand.png", "/exploded/av-stand.png"],
    parts: ["display", "rear", "drawer", "shell", "stand", "base"],
    structural: true,
    copy: "Mobile workstation with VESA plate, lockable drawer, shelves, rails and lockable casters.",
    info: {
      display: [
        "Display mounting arm",
        "Positions the display on the mobile workstation.",
        "Display mount",
      ],
      rear: [
        "VESA mounting plate",
        "Secures a display with standard patterns.",
        "VESA plate",
      ],
      drawer: [
        "Lockable device drawer",
        "Keeps devices, cabling and accessories secure.",
        "Lock and handle",
      ],
      shell: [
        "Accessory shelves",
        "Support computing equipment and peripherals.",
        "Adjustable shelves",
      ],
      stand: [
        "Aluminium support rails",
        "Provide a rigid structural core and cable route.",
        "Support rails",
      ],
      base: [
        "Caster base",
        "Makes the workstation mobile and lockable.",
        "Lockable casters",
      ],
    },
  },
];
const C = {
  black: "#10161a",
  dark: "#05080a",
  green: "#9acb1d",
  board: "#1e6746",
  metal: "#9eabb1",
  white: "#dde3e2",
};
function Label({
  children,
  p,
  r = [0, 0, 0],
  s = 0.22,
}: {
  children: string;
  p: [number, number, number];
  r?: [number, number, number];
  s?: number;
}) {
  return (
    <Text
      position={p}
      rotation={r}
      fontSize={s}
      color="#eff8ef"
      anchorX="center"
      anchorY="middle"
    >
      {children}
    </Text>
  );
}
function Port({
  p,
  c = "#111827",
  s = [0.25, 0.13, 0.04],
}: {
  p: [number, number, number];
  c?: string;
  s?: [number, number, number];
}) {
  return (
    <mesh position={p}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} metalness={0.7} roughness={0.28} />
    </mesh>
  );
}
function Slots({
  p,
  n = 8,
  v = false,
}: {
  p: [number, number, number];
  n?: number;
  v?: boolean;
}) {
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => (
        <mesh
          key={i}
          position={
            v
              ? [0, (i - (n - 1) / 2) * 0.14, 0]
              : [(i - (n - 1) / 2) * 0.14, 0, 0]
          }
        >
          <boxGeometry args={v ? [0.04, 0.09, 0.04] : [0.09, 0.04, 0.04]} />
          <meshBasicMaterial color="#030506" />
        </mesh>
      ))}
    </group>
  );
}
function ProductMesh({
  product,
  explode,
  xray,
  selected,
  onPart,
}: {
  product: Product;
  explode: boolean;
  xray: boolean;
  selected: K | null;
  onPart: (x: K) => void;
}) {
  const refs = useRef<Partial<Record<K, THREE.Group>>>({});
  const part = (k: K, c: React.ReactNode) => (
    <group
      key={k}
      ref={(e) => {
        refs.current[k] = e || undefined;
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPart(k);
      }}
    >
      {c}
    </group>
  );
  useEffect(() => {
    product.parts.forEach((k, i) => {
      const n = refs.current[k];
      if (!n) return;
      const d = product.structural ? 1.05 : 0.72;
      const pos = explode
        ? [
            ((i % 3) - 1) * d,
            (Math.floor(i / 3) - 1) * d * 0.92,
            i % 2 ? 0.48 : -0.48,
          ]
        : [0, 0, 0];
      gsap.to(n.position, {
        x: pos[0],
        y: pos[1],
        z: pos[2],
        duration: 0.72,
        ease: "power3.inOut",
        overwrite: true,
      });
    });
  }, [explode, product]);
  const mat = (k: K, c: string) => (
    <meshStandardMaterial
      color={c}
      metalness={0.65}
      roughness={0.3}
      transparent={xray && ["shell", "front"].includes(k)}
      opacity={xray && ["shell", "front"].includes(k) ? 0.18 : 1}
      emissive={selected === k ? "#078ac4" : "#000"}
      emissiveIntensity={selected === k ? 0.5 : 0}
    />
  );
  if (product.id === "thin")
    return (
      <group rotation={[0.04, -0.55, 0]}>
        {part(
          "shell",
          <>
            <RoundedBox args={[1.55, 3.35, 0.68]} radius={0.12}>
              {mat("shell", C.black)}
            </RoundedBox>
            <mesh position={[0.79, 0, 0.02]}>
              <boxGeometry args={[0.035, 3.1, 0.5]} />
              {mat("shell", C.green)}
            </mesh>
            <Slots p={[0, 1.27, 0.36]} />
            <Slots p={[-0.79, 0, 0]} n={11} v />
          </>,
        )}
        {part(
          "front",
          <group position={[0, 0, 0.39]}>
            <RoundedBox args={[1.28, 2.84, 0.08]} radius={0.06}>
              {mat("front", C.dark)}
            </RoundedBox>
            <mesh position={[0, 1.07, 0.06]}>
              <cylinderGeometry args={[0.16, 0.16, 0.03, 24]} />
              {mat("front", C.black)}
            </mesh>
            <Port p={[0, 0.35, 0.06]} />
            <Port p={[0, -0.58, 0.06]} />
            <Label p={[0, -1.06, 0.08]}>AnuTek</Label>
          </group>,
        )}
        {part(
          "board",
          <mesh>
            <boxGeometry args={[1.1, 2.3, 0.08]} />
            {mat("board", C.board)}
          </mesh>,
        )}
        {part(
          "cooling",
          <mesh position={[-0.15, 0.55, 0.14]}>
            <boxGeometry args={[0.65, 0.62, 0.14]} />
            {mat("cooling", "#26343a")}
          </mesh>,
        )}
        {part(
          "cpu",
          <mesh position={[-0.15, 0.55, 0.25]}>
            <boxGeometry args={[0.4, 0.4, 0.11]} />
            {mat("cpu", "#b79a5c")}
          </mesh>,
        )}
        {part(
          "memory",
          <mesh position={[0.4, 0.4, 0.17]}>
            <boxGeometry args={[0.2, 0.85, 0.08]} />
            {mat("memory", "#2f8a50")}
          </mesh>,
        )}
        {part(
          "storage",
          <mesh position={[0.35, -0.55, 0.17]}>
            <boxGeometry args={[0.18, 0.7, 0.07]} />
            {mat("storage", "#367f55")}
          </mesh>,
        )}
        {part(
          "rear",
          <group position={[0, 0, -0.39]} rotation={[0, Math.PI, 0]}>
            <RoundedBox args={[1.3, 2.85, 0.08]} radius={0.05}>
              {mat("rear", C.dark)}
            </RoundedBox>
            <Port p={[-0.36, 0.74, 0.06]} s={[0.35, 0.22, 0.03]} c="#197bc0" />
            <Port p={[0.35, 0.73, 0.06]} s={[0.32, 0.22, 0.03]} c="#1a5597" />
            <Port p={[-0.35, 0.15, 0.06]} c="#245a9e" />
            <Port p={[0.35, 0.15, 0.06]} c="#175b42" />
          </group>,
        )}
        {part(
          "power",
          <mesh position={[0, -1.06, -0.43]}>
            <cylinderGeometry args={[0.12, 0.12, 0.07, 20]} />
            {mat("power", C.black)}
          </mesh>,
        )}
      </group>
    );
  if (product.id === "mini")
    return (
      <group rotation={[0.36, -0.6, 0]}>
        {part(
          "shell",
          <>
            <RoundedBox args={[2.8, 0.55, 2.35]} radius={0.2}>
              {mat("shell", C.black)}
            </RoundedBox>
            <Slots p={[0, 0.3, 0]} n={12} />
            <Label p={[0, 0.3, 0.72]} r={[-Math.PI / 2, 0, 0]} s={0.28}>
              AnuTek
            </Label>
          </>,
        )}
        {part(
          "board",
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[2.35, 0.08, 1.9]} />
            {mat("board", C.board)}
          </mesh>,
        )}
        {part(
          "cooling",
          <mesh position={[-0.5, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[0.5, 0.5, 0.14, 24]}
            />
            {mat("cooling", C.dark)}
          </mesh>,
        )}
        {part(
          "cpu",
          <mesh position={[-0.5, 0.33, 0]}>
            <boxGeometry args={[0.55, 0.1, 0.55]} />
            {mat("cpu", "#b79a5c")}
          </mesh>,
        )}
        {part(
          "memory",
          <mesh position={[0.65, 0.25, 0]}>
            <boxGeometry args={[0.28, 0.08, 1.1]} />
            {mat("memory", "#2f8a50")}
          </mesh>,
        )}
        {part(
          "storage",
          <mesh position={[0.65, 0.25, 0.65]}>
            <boxGeometry args={[0.24, 0.07, 0.8]} />
            {mat("storage", "#367f55")}
          </mesh>,
        )}
        {part(
          "rear",
          <group position={[0, 0, -1.23]}>
            <Port p={[-0.7, 0, 0.02]} c="#1a5597" />
            <Port p={[0, 0, 0.02]} c="#1a5597" />
            <Port p={[0.7, 0, 0.02]} c="#175b42" />
          </group>,
        )}
        {part(
          "power",
          <mesh position={[1.05, 0, -1.23]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[0.12, 0.12, 0.08, 20]}
            />
            {mat("power", C.dark)}
          </mesh>,
        )}
      </group>
    );
  if (product.id === "stick")
    return (
      <group rotation={[0.08, -0.5, 0]}>
        {part(
          "shell",
          <>
            <RoundedBox args={[0.72, 3.1, 0.42]} radius={0.14}>
              {mat("shell", C.black)}
            </RoundedBox>
            <Label p={[0, 0.3, 0.23]}>AnuTek</Label>
            <Label p={[0, -0.45, 0.23]} s={0.11}>
              intel inside
            </Label>
          </>,
        )}
        {part(
          "rear",
          <mesh position={[0, 1.83, 0]}>
            <boxGeometry args={[0.47, 0.65, 0.22]} />
            {mat("rear", "#bfc6c8")}
          </mesh>,
        )}
        {part(
          "board",
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.5, 2.1, 0.05]} />
            {mat("board", C.board)}
          </mesh>,
        )}
        {part(
          "cpu",
          <mesh position={[0, 0.3, 0.14]}>
            <boxGeometry args={[0.34, 0.34, 0.08]} />
            {mat("cpu", "#b79a5c")}
          </mesh>,
        )}
        {part(
          "memory",
          <mesh position={[0, -0.2, 0.14]}>
            <boxGeometry args={[0.4, 0.48, 0.07]} />
            {mat("memory", "#2f8a50")}
          </mesh>,
        )}
        {part(
          "storage",
          <mesh position={[0, -0.75, 0.14]}>
            <boxGeometry args={[0.4, 0.48, 0.07]} />
            {mat("storage", "#367f55")}
          </mesh>,
        )}
        {part(
          "power",
          <mesh position={[0, -1.35, 0.14]}>
            <boxGeometry args={[0.4, 0.28, 0.08]} />
            {mat("power", C.dark)}
          </mesh>,
        )}
      </group>
    );
  if (product.id === "tower")
    return (
      <group rotation={[0.05, -0.6, 0]}>
        {part(
          "shell",
          <>
            <RoundedBox args={[2.2, 3.7, 1.75]} radius={0.12}>
              {mat("shell", C.black)}
            </RoundedBox>
            <Slots p={[-1.12, 0, 0]} n={15} v />
            <Label p={[0, -1.35, 0.9]}>AnuTek</Label>
          </>,
        )}
        {part(
          "front",
          <group position={[0, 0, 0.92]}>
            <mesh position={[0, 1.12, 0.05]}>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
              {mat("front", C.dark)}
            </mesh>
            <Port p={[-0.38, 0.45, 0.07]} />
            <Port p={[0.38, 0.45, 0.07]} />
            <Slots p={[0, -0.2, 0.07]} />
          </group>,
        )}
        {part(
          "board",
          <mesh position={[-0.15, 0, 0.15]}>
            <boxGeometry args={[1.5, 2.45, 0.1]} />
            {mat("board", C.board)}
          </mesh>,
        )}
        {part(
          "cooling",
          <mesh position={[-0.35, 0.6, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[0.42, 0.42, 0.16, 20]}
            />
            {mat("cooling", C.dark)}
          </mesh>,
        )}
        {part(
          "cpu",
          <mesh position={[-0.35, 0.6, 0.41]}>
            <boxGeometry args={[0.52, 0.52, 0.1]} />
            {mat("cpu", "#b79a5c")}
          </mesh>,
        )}
        {part(
          "memory",
          <mesh position={[0.45, 0.45, 0.32]}>
            <boxGeometry args={[0.2, 1.0, 0.1]} />
            {mat("memory", "#2f8a50")}
          </mesh>,
        )}
        {part(
          "storage",
          <mesh position={[0.45, -0.65, 0.32]}>
            <boxGeometry args={[0.65, 0.48, 0.15]} />
            {mat("storage", "#367f55")}
          </mesh>,
        )}
        {part(
          "rear",
          <mesh position={[0, 0, -0.92]}>
            <boxGeometry args={[1.45, 1.2, 0.1]} />
            {mat("rear", C.dark)}
          </mesh>,
        )}
        {part(
          "power",
          <mesh position={[0.45, -1.18, 0.2]}>
            <boxGeometry args={[0.8, 0.65, 0.42]} />
            {mat("power", C.dark)}
          </mesh>,
        )}
      </group>
    );
  if (product.id === "monitor")
    return (
      <group rotation={[0.06, -0.5, 0]}>
        {part(
          "display",
          <group>
            <RoundedBox args={[4.2, 2.45, 0.16]} radius={0.08}>
              {mat("display", C.dark)}
            </RoundedBox>
            <mesh position={[0, 0, 0.1]}>
              <planeGeometry args={[3.9, 2.15]} />
              <meshStandardMaterial
                color="#173f5f"
                emissive="#0b496f"
                emissiveIntensity={0.55}
              />
            </mesh>
            <Label p={[0, -1.02, 0.12]}>AnuTek</Label>
          </group>,
        )}
        {part(
          "rear",
          <mesh position={[0, 0, -0.16]}>
            <boxGeometry args={[1.3, 0.8, 0.12]} />
            {mat("rear", C.metal)}
          </mesh>,
        )}
        {part(
          "shell",
          <group position={[1.4, 0, -0.29]}>
            <RoundedBox args={[0.43, 1.5, 0.25]} radius={0.08}>
              {mat("shell", C.black)}
            </RoundedBox>
            <Label p={[0, 0.1, 0.14]} s={0.12}>
              AnuTek
            </Label>
          </group>,
        )}
        {part(
          "stand",
          <mesh position={[0, -1.7, 0]}>
            <boxGeometry args={[0.35, 1.0, 0.45]} />
            {mat("stand", C.black)}
          </mesh>,
        )}
        {part(
          "base",
          <mesh position={[0, -2.25, 0]}>
            <boxGeometry args={[2.15, 0.18, 1.1]} />
            {mat("base", C.black)}
          </mesh>,
        )}
      </group>
    );
  const kiosk = product.id === "kiosk";
  return (
    <group rotation={[0, -0.45, 0]}>
      {part(
        "display",
        <group position={[0, 2.15, 0.15]} rotation={[-0.18, 0, 0]}>
          <RoundedBox args={[3.2, 1.9, 0.25]} radius={0.1}>
            {mat("display", C.white)}
          </RoundedBox>
          <mesh position={[0, 0, 0.14]}>
            <planeGeometry args={[2.75, 1.48]} />
            <meshStandardMaterial
              color="#162b3b"
              emissive="#0c4662"
              emissiveIntensity={0.35}
            />
          </mesh>
          <Label p={[0, 0.62, 0.16]} s={0.17}>
            AnuTek
          </Label>
        </group>,
      )}
      {part(
        "front",
        kiosk ? (
          <mesh position={[0, 0.25, 0.1]}>
            <boxGeometry args={[1.1, 2.8, 0.7]} />
            {mat("front", C.white)}
          </mesh>
        ) : (
          <mesh position={[0, 1.9, 0]}>
            <boxGeometry args={[1.5, 0.12, 0.75]} />
            {mat("front", C.metal)}
          </mesh>
        ),
      )}
      {part(
        "drawer",
        product.id === "cart" ? (
          <group position={[0, 0.75, 0.34]}>
            <mesh>
              <boxGeometry args={[2.0, 0.45, 0.65]} />
              {mat("drawer", C.white)}
            </mesh>
            <Label p={[0, 0, 0.36]} s={0.15}>
              AnuTek
            </Label>
          </group>
        ) : (
          <mesh position={[0, 0.2, 0.5]}>
            <boxGeometry args={[0.9, 0.55, 0.12]} />
            {mat("drawer", C.dark)}
          </mesh>
        ),
      )}
      {product.id === "cart" && part(
        "shell",
        <group>
          <mesh position={[0, 0.05, 0.08]}>
            <boxGeometry args={[1.7, 0.12, 0.75]} />
            {mat("shell", C.white)}
          </mesh>
          <mesh position={[0, -0.92, 0.08]}>
            <boxGeometry args={[1.7, 0.12, 0.75]} />
            {mat("shell", C.white)}
          </mesh>
        </group>,
      )}
      {part(
        "board",
        kiosk ? (
          <mesh position={[0, 0.55, -0.25]}>
            <boxGeometry args={[0.55, 0.8, 0.25]} />
            {mat("board", C.dark)}
          </mesh>
        ) : (
          <mesh position={[0, 0.1, 0.1]}>
            <boxGeometry args={[1.65, 0.12, 0.75]} />
            {mat("board", C.white)}
          </mesh>
        ),
      )}
      {part(
        "rear",
        product.id === "cart" ? (
          <mesh position={[0, 3.05, 0]}>
            <boxGeometry args={[1.5, 0.12, 0.75]} />
            {mat("rear", C.metal)}
          </mesh>
        ) : (
          <mesh position={[-0.7, 0.5, -0.1]}>
            <boxGeometry args={[0.14, 2.8, 0.3]} />
            {mat("rear", C.metal)}
          </mesh>
        ),
      )}
      {part(
        "stand",
        <>
          <mesh position={[0, 0.1, -0.1]}>
            <boxGeometry args={[0.38, 3.8, 0.35]} />
            {mat("stand", C.metal)}
          </mesh>
          {product.id === "cart" && (
            <mesh position={[0.32, 0.1, -0.1]}>
              <boxGeometry args={[0.15, 3.8, 0.35]} />
              {mat("stand", C.metal)}
            </mesh>
          )}
        </>,
      )}
      {part(
        "base",
        <group position={[0, -1.75, 0]}>
          <mesh>
            <boxGeometry args={[2.5, 0.25, 1.55]} />
            {mat("base", C.black)}
          </mesh>
          {[
            [-0.9, -0.5],
            [0.9, -0.5],
            [-0.9, 0.5],
            [0.9, 0.5],
          ].map((q, i) => (
            <mesh key={i} position={[q[0], -0.25, q[1]]}>
              <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
              {mat("base", C.black)}
            </mesh>
          ))}
        </group>,
      )}
    </group>
  );
}
function Scene(p: {
  product: Product;
  explode: boolean;
  xray: boolean;
  selected: K | null;
  onPart: (x: K) => void;
  resetToken: number;
}) {
  const { gl } = useThree();
  const controls = useRef<any>(null);
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.45));
  }, [gl]);
  useEffect(() => {
    controls.current?.reset();
  }, [p.resetToken]);
  return (
    <>
      <color attach="background" args={["#071016"]} />
      <ambientLight intensity={0.58} />
      <directionalLight position={[4, 5, 3]} intensity={1.7} color="#d0ecff" />
      <pointLight
        position={[-4, 2, 2]}
        intensity={10}
        color="#0d84ba"
        distance={9}
      />
      <pointLight
        position={[3, -2, 2]}
        intensity={4}
        color="#a2ce2a"
        distance={6}
      />
      <ProductMesh key={p.product.id} {...p} />
      <gridHelper
        args={[16, 24, "#1e6076", "#102934"]}
        position={[0, -2.75, 0]}
      />
      <ContactShadows
        position={[0, -2.72, 0]}
        opacity={0.55}
        scale={8}
        blur={2.4}
      />
      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={4}
        maxDistance={9}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!p.explode}
        autoRotateSpeed={0.45}
      />
      <Environment preset="city" />
    </>
  );
}
export default function ThinClientLab({
  productId,
  detailSlug,
  detail = false,
}: {
  productId?: string;
  detailSlug?: string;
  detail?: boolean;
}) {
  const [id, setId] = useState(productId || "thin"),
    [explode, setExplode] = useState(false),
    [xray, setXray] = useState(false),
    [selected, setSelected] = useState<K | null>(null),
    [full, setFull] = useState(false),
    [resetToken, setResetToken] = useState(0),
    [tab, setTab] = useState<"3d" | "exploded" | "photos" | "specs">("3d");
  const stageRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (productId) setId(productId);
  }, [productId]);
  useEffect(() => {
    const syncFullScreen = () => setFull(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", syncFullScreen);
    return () => document.removeEventListener("fullscreenchange", syncFullScreen);
  }, []);
  const product = products.find((p) => p.id === id)!;
  const info = selected ? product.info[selected] : null;
  const spec = detailSlug ? productSpecs[detailSlug] : undefined;
  const isScene = !detail || tab === "3d" || tab === "exploded";
  const activeExplode = detail ? tab === "exploded" : explode;
  return (
    <main className={"lab-page " + (detail ? "lab-detail-page" : "")}>
      {detail && <div className="detail-lab-tabs" role="tablist" aria-label="Product media views">
        {[["3d", "3D View"], ["exploded", "Exploded View"], ["photos", "Photo Views"], ["specs", "Technical Specifications"]].map(([value, label]) => <button key={value} role="tab" aria-selected={tab === value} className={tab === value ? "active" : ""} onClick={() => { setTab(value as typeof tab); setSelected(null); }}>{label}</button>)}
      </div>}
      {isScene && <section ref={stageRef} className={"lab-stage " + (full ? "lab-full" : "")}>
        <div className="lab-intro">
          <span>ANUTEK PRODUCT LAB / {product.kind}</span>
          <h1>
            {product.name}
            <br />
            <em>made visible.</em>
          </h1>
          <p>{product.copy}</p>
        </div>
        <Canvas
          dpr={[1, 1.45]}
          camera={{ position: [4.8, 2.7, 5.2], fov: 42 }}
          fallback={
            <div className="lab-fallback">
              <img src={product.photos[0]} alt={`${product.name} reference`} />
            </div>
          }
        >
          <Scene
            product={product}
            explode={activeExplode}
            xray={xray}
            selected={selected}
            onPart={setSelected}
            resetToken={resetToken}
          />
        </Canvas>
        {!detail && <div className="lab-selector" aria-label="Select product model">
          {products.map((p) => (
            <button
              key={p.id}
              aria-pressed={p.id === id}
              onClick={() => {
                setId(p.id);
                setExplode(false);
                setXray(false);
                setSelected(null);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>}
        <div className="lab-controls">
          <div>
            <ScanSearch size={17} />
            <b>Live hardware inspection</b>
          </div>
          <button onClick={() => detail ? setTab(tab === "exploded" ? "3d" : "exploded") : setExplode((v) => !v)} aria-pressed={activeExplode}>
            <Rotate3D />
            {activeExplode ? "Reassemble" : "Explode"}
          </button>
          <button onClick={() => setXray((v) => !v)} aria-pressed={xray}>
            <Eye />X Ray
          </button>
          <button
            onClick={() => {
              setExplode(false);
              setXray(false);
              setSelected(null);
              setTab("3d");
              setResetToken((v) => v + 1);
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else stageRef.current?.requestFullscreen();
            }}
            aria-label={full ? "Exit full screen" : "Full screen"}
          >
            {full ? <X /> : <Expand />}
          </button>
        </div>
        {activeExplode && (
          <div className="lab-hotspots">
            {product.parts.map((k, i) => (
              <button
                key={k}
                className={selected === k ? "active" : ""}
                onClick={() => setSelected(k)}
              >
                <i>{String(i + 1).padStart(2, "0")}</i>
                <span>{product.info[k]?.[0] || k}</span>
              </button>
            ))}
          </div>
        )}
        {info && (
          <aside className="lab-panel">
            <button
              onClick={() => setSelected(null)}
              aria-label="Close component information"
            >
              <X />
            </button>
            <span>
              COMPONENT /{" "}
              {String(product.parts.indexOf(selected!) + 1).padStart(2, "0")}
            </span>
            <h2>{info[0]}</h2>
            <p>{info[1]}</p>
            <dl>
              <div>
                <dt>Visible / typical interfaces</dt>
                <dd>{info[2]}</dd>
              </div>
              <div>
                <dt>Enterprise relevance</dt>
                <dd>
                  {product.structural
                    ? "Supports a maintainable, serviceable deployment."
                    : "Supports reliable, managed endpoint operation."}
                </dd>
              </div>
            </dl>
          </aside>
        )}
        <p className="lab-disclaimer">
          {product.structural
            ? "Illustrative structural breakdown"
            : "Illustrative internal architecture"}
          <span>•</span>
          {product.structural
            ? "Final structural configuration varies by approved project specification."
            : "Final internal configuration varies by approved project specification."}
        </p>
      </section>}
      {(!detail || tab === "photos") && <section className="lab-evidence">
        <div className="lab-section-heading">
          <span>PRODUCT EVIDENCE</span>
          <h2>Captured Product Views</h2>
          <p>
            Original approved product photographs remain the factual reference
            for the selected model.
          </p>
        </div>
        <div className="evidence-strip">
          {product.photos.map((src, i) => (
            <figure key={src}>
              <img src={src} alt={`${product.name} captured view ${i + 1}`} />
              <figcaption>
                {product.name} / captured view {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="evidence-note">
          A full 360 degree image sequence or approved CAD model can be
          integrated when available.
        </p>
      </section>}
      {detail && tab === "specs" && spec && <section className="detail-specifications" aria-label="Technical specifications"><div><span>TECHNICAL SPECIFICATIONS</span><h2>{product.name} configuration overview</h2><p>Published product details are shown for evaluation. Final configuration is determined by the approved project specification.</p></div><div className="spec-table-wrap"><table><thead><tr><th>Feature</th>{spec.models.map((model) => <th key={model}>{model}</th>)}</tr></thead><tbody>{spec.rows.map(([feature, values]) => <tr key={feature}><th>{feature}</th>{values.map((value, index) => <td key={spec.models[index]}>{value}</td>)}</tr>)}</tbody></table></div></section>}
    </main>
  );
}
