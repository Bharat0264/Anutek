"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";

type Film = { id: string; title: string; poster: string };

export default function ProductFilm({ film }: { film: Film }) {
  const [open, setOpen] = useState(false);
  const [finale, setFinale] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const close = () => { video.current?.pause(); setOpen(false); setFinale(false); };
  return <>
    <button className="watch-film" onClick={() => setOpen(true)}><Play size={15} fill="currentColor"/> Watch Product Film</button>
    {open && <div className="film-modal" role="dialog" aria-modal="true" aria-label={`${film.title} product film`}>
      <button className="film-backdrop" aria-label="Close product film" onClick={close}/>
      <div className="film-panel">
        <button className="film-close" onClick={close} aria-label="Close product film"><X/></button>
        <div className="film-frame">
          <video ref={video} controls autoPlay preload="metadata" poster={film.poster} onTimeUpdate={(event) => setFinale(event.currentTarget.currentTime >= 8)} onEnded={() => setFinale(true)}>
            <source src={`/product-films/${film.id}.mp4`} type="video/mp4"/>
          </video>
          <div className="film-title"><b>ANUTEK / {film.title}</b><span>PRODUCT FILM · 10 SEC</span></div>
          {finale && <div className="film-finale"><b>ANUTEK</b><strong>{film.title}</strong><p>Enterprise hardware, made visible.</p><Link href="/contact">Enquire now</Link></div>}
        </div>
      </div>
    </div>}
  </>;
}
