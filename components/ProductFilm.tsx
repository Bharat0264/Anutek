"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

type Film = { src: string; title: string; poster: string };

export default function ProductFilm({ film }: { film: Film }) {
  const [open, setOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const close = () => { video.current?.pause(); setOpen(false); };
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === "Escape") close(); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
  return <>
    <button className="watch-film" onClick={() => setOpen(true)}><Play size={15} fill="currentColor"/> Watch Product Film</button>
    {open && <div className="film-modal" role="dialog" aria-modal="true" aria-label={`${film.title} product film`}>
      <button className="film-backdrop" aria-label="Close product film" onClick={close}/>
      <div className="film-panel">
        <button className="film-close" onClick={close} aria-label="Close product film"><X/></button>
        <div className="film-frame">
          <video ref={video} controls autoPlay muted={false} preload="none" poster={film.poster}>
            <source src={film.src} type="video/mp4"/>
          </video>
          <div className="film-title"><b>ANUTEK / {film.title}</b><span>PRODUCT FILM · 10 SEC</span></div>
        </div>
      </div>
    </div>}
  </>;
}
