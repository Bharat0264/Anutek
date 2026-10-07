"use client";

import { useState } from "react";
const slides=[
  ["/showcase/mini-pc-retail.png","MINI PC // DISPLAY UNIT"],
  ["/showcase/conference-retail.png","CONFERENCE // DEPLOYMENT"],
  ["/showcase/desktop-retail.png","DESKTOP // ECOSYSTEM"],
  ["/showcase/complete-system.png","COMPLETE // WORKSTATION"],
  ["/showcase/mini-pc-ports.png","MINI PC // I/O SCAN"],
];
export default function ShowcaseDeck(){const [active,setActive]=useState(0);return <section className="showcase-deck"><div className="deck-copy"><span>ANUTEK // IMMERSIVE CATALOGUE</span><h2>Enter the<br/><em>showroom.</em></h2><p>Move through the current visual collection. Each image becomes a layered exhibit in the 3D interface.</p><div className="deck-nav">{slides.map(([,label],i)=><button key={label} aria-label={"Open "+label} className={i===active?"on":""} onClick={()=>setActive(i)}>0{i+1}</button>)}</div></div><div className={"deck-stage turn"+active}>{slides.map(([image,label],i)=><button className={"deck-card c"+i+(i===active?" active":"")} key={label} onClick={()=>setActive(i)}><img src={image} alt={label}/><span>{label}</span></button>)}<i className="deck-axis x"/><i className="deck-axis y"/></div></section>}
