"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ gallery, name }) {
  const [index, setIndex] = useState(0);
  if (!gallery.length) return <div className="gallery-main"><div className="media-placeholder">No image</div></div>;
  const current = gallery[index];
  return (
    <div className="gallery">
      <div className="gallery-main">
        {current.kind === "image"
          ? <Image src={current.url} alt={name} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          : <video key={current.url} src={current.url} controls playsInline autoPlay muted loop />}
      </div>
      {gallery.length > 1 && (
        <div className="gallery-thumbs">
          {gallery.map((m, i) => (
            <button key={m.url} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Show ${m.kind} ${i + 1}`}>
              {m.kind === "image" ? <Image src={m.url} alt="" fill sizes="80px" /> : <span>▶ Video</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
