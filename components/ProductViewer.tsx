"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Rotate3D, X } from "lucide-react";
import { productSpecs } from "../data/productSpecs";

type Product = { title: string; image: string; intro: string; models: string[]; details: [string, string][] };

const assets: Record<string, { group: string; count: number; exploded: string }> = {
  "thin-clients": { group: "thin-clients", count: 5, exploded: "/exploded/thin-client.png" },
  "mini-pc": { group: "mini-pc", count: 4, exploded: "/exploded/mini-pc-core.png" },
  "tower-desktop": { group: "tower-desktop", count: 4, exploded: "/exploded/device-core.png" },
  "desktop-pc": { group: "desktop-pc", count: 1, exploded: "/exploded/monitor-stick.png" },
  "all-in-one": { group: "all-in-one", count: 4, exploded: "/exploded/monitor-stick.png" },
};

export default function ProductViewer({ slug, product, onClose }: { slug: string; product: Product; onClose: () => void }) {
  const [image, setImage] = useState(0);
  const [view, setView] = useState<"gallery" | "exploded">("gallery");
  const asset = assets[slug];
  const specs = productSpecs[slug];
  const images = Array.from({ length: asset.count }, (_, index) => `/legacy/${asset.group}/${index + 1}.jpg`);
  const next = () => setImage((image + 1) % images.length);
  const previous = () => setImage((image + images.length - 1) % images.length);
  return <div className="product-modal" role="dialog" aria-modal="true" aria-label={`${product.title} product viewer`}>
    <button className="modal-backdrop" aria-label="Close product viewer" onClick={onClose}/>
    <div className="product-modal-panel">
      <header><div><span>ANUTEK / PRODUCT EXPLORER</span><h2>{product.title}</h2></div><button onClick={onClose} className="modal-close" aria-label="Close"><X/></button></header>
      <div className="modal-tabs"><button className={view === "gallery" ? "active" : ""} onClick={() => setView("gallery")}>Product gallery</button><button className={view === "exploded" ? "active" : ""} onClick={() => setView("exploded")}>Exploded view</button></div>
      <div className="modal-visual">
        {view === "gallery" ? <><button className="gallery-arrow left" onClick={previous} aria-label="Previous image"><ChevronLeft/></button><img src={images[image]} alt={`${product.title} view ${image + 1}`}/><button className="gallery-arrow right" onClick={next} aria-label="Next image"><ChevronRight/></button><div className="gallery-dots">{images.map((src,index)=><button key={src} onClick={() => setImage(index)} className={image === index ? "active" : ""} aria-label={`Show image ${index + 1}`}/>)}</div></> : <img className="modal-exploded" src={asset.exploded} alt={`${product.title} exploded component view`}/>} 
      </div>
      <section className="spin-section"><div><span>3D PRODUCT PREVIEW</span><h3>Continuous 360° showcase</h3><p>Five-second looping presentation animation.</p></div><div className="spin-scene"><div className="spin-cube">{["front","back","left","right"].map(face=><div key={face} className={`spin-face ${face}`}><img src={product.image.startsWith("/") ? product.image : `/${product.image}`} alt=""/></div>)}</div></div><Rotate3D/></section>
      <section className="modal-specs"><div><span>MODEL COMPARISON</span><h3>Configuration overview</h3><p>Source-accurate published specifications for product evaluation.</p></div><div className="modal-table-wrap"><table><thead><tr><th>Feature</th>{specs.models.map(model=><th key={model}>{model}</th>)}</tr></thead><tbody>{specs.rows.map(([feature,values])=><tr key={feature}><th>{feature}</th>{values.map((value,index)=><td key={specs.models[index]}>{value}</td>)}</tr>)}</tbody></table></div><Link href={`/${slug}`} onClick={onClose}>Open full specifications <ChevronRight size={15}/></Link></section>
    </div>
  </div>;
}
