"use client";

import { useState } from "react";

type System = { title: string; image: string; summary: string; parts: [string, string][] };

const systems: System[] = [
  { title: "Mobile Stand", image: "/exploded/mobile-stand.png", summary: "A secure, adaptable workstation for displays and peripherals.", parts: [["VESA mounting plate", "Secures a display using standard 75/100 mm patterns."], ["Lockable drawer", "Keeps a Mini PC, cables and accessories protected."], ["Adjustable shelves", "Position devices at the height that suits the workflow."], ["Caster base", "Lets the unit move safely and lock into position."]] },
  { title: "AV Equipment Stand", image: "/exploded/av-stand.png", summary: "A mobile presentation and AV equipment station.", parts: [["VESA plate", "Holds the display securely."], ["Aluminium column", "Provides a rigid, lightweight support structure."], ["Cable channel", "Routes display and power cables cleanly."], ["Locking casters", "Provide mobile deployment without compromising stability."]] },
  { title: "Interactive Kiosk", image: "/exploded/interactive-kiosk.png", summary: "A robust public-facing information and engagement kiosk.", parts: [["Touch display", "Lets visitors interact directly with digital services."], ["Mini PC", "Runs kiosk content, applications and connectivity."], ["Power distribution", "Delivers protected power to the internal system."], ["Cable management", "Keeps the serviceable internal layout safe and tidy."]] },
  { title: "Conference Kit", image: "/exploded/conference-kit.png", summary: "Mini PC and gooseneck microphone for meeting-room collaboration.", parts: [["Conference microphone", "Captures clear speech for meetings and lectures."], ["Control board", "Manages microphone controls and audio signal handling."], ["Mini PC", "Drives displays, meeting applications and network access."], ["Cooling system", "Maintains reliable performance under continuous use."]] },
  { title: "Monitor + Compute Stick", image: "/exploded/monitor-stick.png", summary: "A streamlined display system that converts any workspace into a PC.", parts: [["Compute stick", "Adds a compact Intel-based PC to the monitor."], ["Rear I/O", "Connects power, display output and USB peripherals."], ["Speakers", "Provide integrated sound without separate hardware."], ["Tilt stand", "Supports an ergonomic viewing angle."]] },
  { title: "Mini PC — Core", image: "/exploded/mini-pc-core.png", summary: "Compact performance hardware for business, education and meeting rooms.", parts: [["Processor", "Executes applications and multitasking workloads."], ["Cooling fan + heat sink", "Moves heat away to sustain stable performance."], ["SO-DIMM RAM", "Provides fast working memory for active tasks."], ["M.2 SSD", "Stores Windows, applications and files with rapid access."]] },
  { title: "Mini PC — Pro", image: "/exploded/mini-pc-pro.png", summary: "A detailed Mini PC service view with upgradeable internals.", parts: [["Top cover", "Protects internal components while allowing servicing."], ["M.2 SSD slot", "Supports fast NVMe or SATA solid-state storage."], ["Wi-Fi module", "Enables optional wireless networking."], ["Ventilated base", "Promotes airflow and protects the device on a desk."]] },
  { title: "Thin Client", image: "/exploded/thin-client.png", summary: "A compact endpoint built for managed and virtual desktop environments.", parts: [["Main PCB", "Coordinates processing, interfaces and connected devices."], ["VGA / HDMI", "Connects legacy and modern displays."], ["LAN controller", "Provides dependable wired network access."], ["Metal enclosure", "Protects electronics and supports thermal management."]] },
  { title: "Device Core", image: "/exploded/device-core.png", summary: "A compact connectivity unit with a clearly serviceable internal board.", parts: [["Ethernet controller", "Provides stable RJ45 network communication."], ["USB hub controller", "Manages multiple connected USB devices."], ["VGA controller", "Converts signals for compatible display output."], ["Power management", "Regulates incoming DC power for the electronics."]] },
];

export default function ExplodedGallery() {
  const [active, setActive] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const system = systems[active];
  return <section className="exploded-lab" id="exploded-lab">
    <div className="exploded-heading"><span>INTERACTIVE PRODUCT ANATOMY</span><h2>Explore the <em>inside</em></h2><p>Select a system to inspect its components and understand why every part matters.</p></div>
    <div className="exploded-tabs" role="tablist">{systems.map((item, index) => <button key={item.title} onClick={() => { setActive(index); setIsRotating(false); }} className={active === index ? "active" : ""} role="tab" aria-selected={active === index}>{String(index + 1).padStart(2, "0")} <b>{item.title}</b></button>)}</div>
    <div className="exploded-stage" key={system.image}>
      <div className="exploded-image"><img className={isRotating ? "spin-preview" : ""} src={system.image} alt={`${system.title} exploded view`} /><button className="view-360" onClick={() => setIsRotating(!isRotating)} aria-pressed={isRotating}>{isRotating ? "Pause" : "Play"} 360° Preview</button></div>
      <aside><span>ACTIVE SYSTEM / {String(active + 1).padStart(2, "0")}</span><h3>{system.title}</h3><p>{system.summary}</p><small className="preview-note">360° preview animates the supplied product visual. Multi-angle renders can be added later for a true drag-to-rotate product view.</small><ol>{system.parts.map(([name, purpose], index) => <li key={name}><i>{String(index + 1).padStart(2, "0")}</i><div><b>{name}</b><p>{purpose}</p></div></li>)}</ol></aside>
    </div>
  </section>;
}
