import { useEffect, useState } from 'react'

const SHOTS = [
  { src: '/demo/carousel-1.png', alt: 'A full Layer desktop — display clock, notes, weather and now playing' },
  { src: '/demo/carousel-2.png', alt: 'Layer widgets arranged across the desktop' },
  { src: '/demo/carousel-3.png', alt: 'A Layer layout with calendar, clipboard and stats' },
  { src: '/demo/carousel-4.png', alt: 'Another Layer desktop arrangement' },
]

const INTERVAL = 4500

export function Carousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = SHOTS.length
  const go = (k: number) => setIndex(((k % n) + n) % n)

  // Auto-advance, paused on hover so people can look.
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => setIndex((p) => (p + 1) % n), INTERVAL)
    return () => window.clearInterval(id)
  }, [paused, n])

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SHOTS.map((s) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>

      <button
        type="button"
        className="carousel-arrow left"
        onClick={() => go(index - 1)}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel-arrow right"
        onClick={() => go(index + 1)}
        aria-label="Next"
      >
        ›
      </button>

      <div className="carousel-dots">
        {SHOTS.map((s, i) => (
          <button
            key={s.src}
            type="button"
            className={i === index ? 'active' : ''}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
