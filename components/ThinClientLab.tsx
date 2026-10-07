"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import { Expand, Eye, Rotate3D, RotateCcw, ScanSearch, X } from "lucide-react";

type PartKey = "front" | "chassis" | "cooling" | "mainboard" | "processor" | "memory" | "storage" | "rear" | "power";
type Inspection = { name: string; purpose: string; interfaces: string; relevance: string };

const inspection: Record<PartKey, Inspection> = {
  front: { name: "Front I/O panel", purpose: "Direct access to USB and audio peripherals for user workstations.", interfaces: "USB Type-A, audio and power control.", relevance: "Keeps essential user connections reachable in managed work areas." },
  chassis: { name: "Chassis and ventilation", purpose: "Protects internal hardware and supports reliable thermal operation.", interfaces: "Ventilation paths and serviceable enclosure.", relevance: "Designed for dependable continuous deployment." },
  cooling: { name: "Cooling / ventilation assembly", purpose: "Moves heat away from operating components.", interfaces: "Fan and airflow path.", relevance: "Supports stable operation across long work sessions." },
  mainboard: { name: "Mainboard", purpose: "Coordinates processor, memory, storage and device connectivity.", interfaces: "Internal expansion and I/O connections.", relevance: "The integration layer for centrally managed environments." },
  processor: { name: "Processor", purpose: "Runs the operating environment and remote desktop workload.", interfaces: "Processor module.", relevance: "Enables responsive enterprise computing workloads." },
  memory: { name: "Memory", purpose: "Supports responsive multitasking and virtual desktop sessions.", interfaces: "Memory module interface.", relevance: "Helps maintain a smooth user experience." },
  storage: { name: "Storage", purpose: "Holds operating system, configurations and local application data where required.", interfaces: "M.2-style storage module.", relevance: "Supports consistent configured endpoints." },
  rear: { name: "Rear I/O board", purpose: "Connects displays and managed network peripherals.", interfaces: "LAN, VGA, HDMI, USB and audio.", relevance: "Supports office, education, control-room and kiosk deployments." },
  power: { name: "Power input", purpose: "Supplies regulated power for continuous operation.", interfaces: "DC input assembly.", relevance: "Built for stable installed environments." },
};
const partOrder: PartKey[] = ["front", "chassis", "cooling", "mainboard", "processor", "memory", "storage", "rear", "power"];

function Port({ position, color = "#111827", size = [0.28, 0.13, 0.03] as [number, number, number] }: { position: [number, number, number]; color?: string; size?: [number, number, number] }) {
  return <mesh position={position}><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={0.75} roughness={0.3}/></mesh>;
}
function Vents({ position, rotation = [0, 0, 0] as [number, number, number] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return <group position={position} rotation={rotation}>{Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(i - 3.5) * .13, 0, 0]}><boxGeometry args={[.045, .46, .025]}/><meshBasicMaterial color="#070a0d"/></mesh>)}</group>;
}

function ThinClientModel({ explode, xray, selected, onSelect }: { explode: boolean; xray: boolean; selected: PartKey | null; onSelect: (key: PartKey) => void }) {
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const targets = useRef<Record<string, number>>({});
  useEffect(() => {
    const layout: Record<PartKey, [number, number, number]> = { front: [-2.4, 0, 0], chassis: [0, .95, 0], cooling: [0, .35, .1], mainboard: [0, 0, 0], processor: [-.35, .65, .35], memory: [.95, .45, .1], storage: [1.35, -.1, .2], rear: [2.3, 0, 0], power: [2.15, -.75, -.1] };
    partOrder.forEach(key => {
      const r = refs.current[key]; if (!r) return;
      const to = explode ? layout[key] : [0, 0, 0];
      gsap.to(r.position, { x: to[0], y: to[1], z: to[2], duration: .85, ease: "power3.inOut", overwrite: true });
      gsap.to(r.rotation, { z: explode && key === "front" ? -.08 : 0, duration: .85, ease: "power3.inOut", overwrite: true });
    });
  }, [explode]);
  const material = (key: PartKey, color: string) => <meshStandardMaterial color={color} metalness={.72} roughness={.28} transparent={xray && key === "chassis"} opacity={xray && key === "chassis" ? .18 : 1} emissive={selected === key ? "#0baeff" : "#000000"} emissiveIntensity={selected === key ? .55 : 0}/>;
  const group = (key: PartKey, children: React.ReactNode) => <group ref={el => { refs.current[key] = el; }} onClick={(e) => { e.stopPropagation(); onSelect(key); }}>{children}</group>;
  return <group rotation={[0.06, -.65, 0]}>
    {group("chassis", <><RoundedBox args={[2.25, 3.7, .72]} radius={.12} smoothness={4}>{material("chassis", "#151b20")}</RoundedBox><mesh position={[1.145, 0, 0]}><boxGeometry args={[.04, 3.45, .52]}/>{material("chassis", "#a9dc26")}</mesh><Vents position={[0, 1.15, .38]} rotation={[0, 0, Math.PI / 2]}/><Vents position={[0, -1.12, .38]} rotation={[0, 0, Math.PI / 2]}/></>)}
    {group("front", <group position={[0, 0, .4]}><RoundedBox args={[1.82, 3.15, .11]} radius={.06} smoothness={3}>{material("front", "#090d10")}</RoundedBox><mesh position={[0, 1.17, .08]}><cylinderGeometry args={[.18, .18, .035, 24]}/><meshStandardMaterial color="#172027" emissive="#9bd60e" emissiveIntensity={.7}/></mesh><Port position={[0, .42, .09]}/><Port position={[0, -.48, .09]}/><mesh position={[0, -.03, .09]}><torusGeometry args={[.1,.025,8,24]}/><meshStandardMaterial color="#b7cfda"/></mesh><mesh position={[0, -.23, .09]}><torusGeometry args={[.1,.025,8,24]}/><meshStandardMaterial color="#e38b9a"/></mesh><mesh position={[0, -1.27, .09]}><planeGeometry args={[.78,.22]}/><meshBasicMaterial color="#eef4f5"/></mesh></group>)}
    {group("rear", <group position={[0, 0, -.42]} rotation={[0, Math.PI, 0]}><RoundedBox args={[1.8, 3.15, .1]} radius={.05} smoothness={3}>{material("rear", "#090d10")}</RoundedBox><Port position={[-.48, .8, .08]} color="#1778be" size={[.42,.25,.035]}/><Port position={[.44, .82, .08]} color="#174f9c" size={[.36,.25,.035]}/><Port position={[-.42, .3,.08]} color="#114b9b"/><Port position={[.43,.3,.08]} color="#095136"/><Port position={[-.42,-.35,.08]}/><Port position={[.42,-.35,.08]}/><mesh position={[0,-1.03,.08]}><cylinderGeometry args={[.12,.12,.04,20]}/>{material("power", "#101419")}</mesh></group>)}
    {group("mainboard", <group position={[0,0,.02]}><RoundedBox args={[1.52,2.45,.09]} radius={.06} smoothness={2}>{material("mainboard", "#1c5b3c")}</RoundedBox>{Array.from({length:9},(_,i)=><mesh key={i} position={[-.55+(i%3)*.55,.7-Math.floor(i/3)*.66,.075]}><boxGeometry args={[.27,.22,.06]}/><meshStandardMaterial color="#0c1714" metalness={.4}/></mesh>)}</group>)}
    {group("cooling", <group position={[-.22,.15,.14]}><mesh rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[.42,.42,.13,4]}/>{material("cooling", "#8d4c26")}</mesh><mesh position={[0,0,.1]}><cylinderGeometry args={[.35,.35,.07,20]}/><meshStandardMaterial color="#111922"/></mesh></group>)}
    {group("processor", <mesh position={[-.25,.18,.25]}><boxGeometry args={[.52,.52,.12]}/>{material("processor", "#b7a565")}</mesh>)}
    {group("memory", <mesh position={[.55,.38,.2]} rotation={[0,0,.05]}><boxGeometry args={[.32,1.15,.08]}/>{material("memory", "#267143")}</mesh>)}
    {group("storage", <mesh position={[.55,-.68,.2]} rotation={[0,0,-.1]}><boxGeometry args={[.27,.95,.07]}/>{material("storage", "#1d6c4b")}</mesh>)}
    {group("power", <mesh position={[.55,-1.12,.13]}><boxGeometry args={[.48,.38,.18]}/>{material("power", "#111820")}</mesh>)}
  </group>;
}

function Scene({ explode, xray, selected, onSelect, resetKey }: { explode: boolean; xray: boolean; selected: PartKey | null; onSelect: (p: PartKey) => void; resetKey: number }) {
  const orbit = useRef<any>(null); const { gl } = useThree();
  useEffect(() => { if (orbit.current) { orbit.current.reset(); orbit.current.target.set(0,0,0); orbit.current.update(); } }, [resetKey]);
  useEffect(() => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.6)); }, [gl]);
  return <><color attach="background" args={["#081017"]}/><fog attach="fog" args={["#081017", 7, 15]}/><ambientLight intensity={.5}/><directionalLight position={[4,5,5]} intensity={1.6} color="#b9e7ff"/><pointLight position={[-4,1,3]} intensity={12} color="#167fd0" distance={8}/><pointLight position={[3,-2,2]} intensity={4} color="#a9dc26" distance={6}/><ThinClientModel explode={explode} xray={xray} selected={selected} onSelect={onSelect}/><gridHelper args={[16,24,"#1c607b","#132733"]} position={[0,-2.25,0]}/><ContactShadows position={[0,-2.22,0]} opacity={.55} scale={7} blur={2.4} far={4}/><OrbitControls ref={orbit} enablePan={false} minDistance={4} maxDistance={8} minPolarAngle={.7} maxPolarAngle={2.25} dampingFactor={.08} enableDamping/><Environment preset="city"/></>;
}

const photos = ["/codex-clipboard-9a2f571c-34a3-4b7d-aeb1-46c0d4c550b9.png","/codex-clipboard-8005673c-193e-423a-8dae-b92fe630bc3e.png","/codex-clipboard-cf4415c5-3051-4c04-813a-0fa9c93d30a5.png"];
const deployments = [
  ["Government and institutional computing","/legacy/thin-clients/1.jpg","Managed endpoints for structured, centrally administered work environments."],
  ["Lecture hall and conference presentation","/showcase/conference-retail.png","Compact computing and display connectivity for presentation settings."],
  ["Mobile healthcare workstation","/exploded/mobile-stand.png","A mobile workstation context where compact hardware supports flexible setups."],
  ["Interactive information kiosk","/showcase/interactive-kiosk.png","Touch-led information access for public and institutional spaces."],
  ["Desktop and monitor ecosystem","/showcase/complete-system.png","A cohesive desktop, display and peripheral presentation."],
];

export default function ThinClientLab(){
  const [explode,setExplode]=useState(false),[xray,setXray]=useState(false),[selected,setSelected]=useState<PartKey | null>(null),[resetKey,setResetKey]=useState(0),[full,setFull]=useState(false);
  const panel=selected?inspection[selected]:null;
  const reset=useCallback(()=>{setExplode(false);setXray(false);setSelected(null);setResetKey(v=>v+1)},[]);
  return <main className="lab-page"><section className={"lab-stage "+(full?"lab-full":"")} aria-label="Interactive AnuTek Thin Client product model"><div className="lab-intro"><span>ANUTEK PRODUCT LAB / THIN CLIENT</span><h1>Enterprise hardware,<br/><em>made visible.</em></h1><p>Inspect a representative Thin Client architecture, its interfaces and the environments it supports.</p></div><Canvas dpr={[1,1.6]} camera={{position:[4.8,2.7,5.2],fov:42}} shadows><Scene explode={explode} xray={xray} selected={selected} onSelect={setSelected} resetKey={resetKey}/></Canvas><div className="lab-controls" aria-label="Live hardware inspection controls"><div><ScanSearch size={17}/><b>Live hardware inspection</b></div><button onClick={()=>setExplode(v=>!v)} aria-pressed={explode}><Rotate3D/> {explode?"Assemble":"Explode"}</button><button onClick={()=>setXray(v=>!v)} aria-pressed={xray}><Eye/> X Ray</button><button onClick={reset}><RotateCcw/> Reset</button><button onClick={()=>setFull(v=>!v)} aria-label={full?"Exit full screen":"Full screen"}>{full?<X/>:<Expand/>}</button></div>{explode&&<div className="lab-hotspots" aria-label="Component hotspots">{partOrder.map((key,i)=><button className={selected===key?"active":""} onClick={()=>setSelected(key)} key={key} aria-label={`Inspect ${inspection[key].name}`}><i>{String(i+1).padStart(2,"0")}</i><span>{inspection[key].name}</span></button>)}</div>}{panel&&<aside className="lab-panel"><button aria-label="Close component information" onClick={()=>setSelected(null)}><X/></button><span>COMPONENT {String(partOrder.indexOf(selected!)+1).padStart(2,"0")}</span><h2>{panel.name}</h2><p>{panel.purpose}</p><dl><div><dt>Visible / typical interfaces</dt><dd>{panel.interfaces}</dd></div><div><dt>Enterprise relevance</dt><dd>{panel.relevance}</dd></div></dl></aside>}<p className="lab-disclaimer">Illustrative internal architecture <span>•</span> Final internal configuration varies by approved project specification.</p></section><section className="lab-evidence"><div className="lab-section-heading"><span>PRODUCT EVIDENCE</span><h2>Captured Product Views</h2><p>Original approved product photographs remain the factual reference.</p></div><div className="evidence-strip">{photos.map((src,i)=><figure key={src}><img src={src} alt={["Front Thin Client view","Rear I/O Thin Client view","Side Thin Client view"][i]}/><figcaption>{["Front controls","Rear I/O","Slim side profile"][i]}</figcaption></figure>)}</div><p className="evidence-note">A full 360 degree image sequence or approved CAD model can be integrated when available.</p></section><section className="lab-deployments" id="deployments"><div className="lab-section-heading"><span>DEPLOYMENT CONTEXTS</span><h2>Built for considered environments.</h2></div><div>{deployments.map(([title,src,copy])=><article key={title}><img src={src} alt={title}/><h3>{title}</h3><p>{copy}</p></article>)}</div></section></main>
}
