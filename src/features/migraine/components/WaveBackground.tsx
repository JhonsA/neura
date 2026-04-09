// Build-time flag — replaced as a literal by Vite at compile time.
// Enables dead-code elimination: the unused branch won't appear in the bundle.
const WAVE_ANIMATED = import.meta.env.VITE_WAVE_ANIMATED === 'true'

// Star positions: [cx, cy, r, opacity]
// Max 10, low opacity (0.10–0.20) for subtle sky texture.
const STARS: Array<[number, number, number, number]> = [
  [42,  38,  1.2, 0.15],  [202, 52,  1.4, 0.18],
  [340, 28,  1.1, 0.14],  [278, 75,  0.9, 0.12],
  [88,  162, 0.8, 0.10],  [310, 135, 1.2, 0.16],
  [160, 122, 0.7, 0.12],  [240, 14,  1.0, 0.14],
  [25,  190, 1.0, 0.11],  [218, 178, 1.2, 0.15],
]

/**
 * Stars layer (static) + wave layers (animated when VITE_WAVE_ANIMATED=true).
 * Stars render behind waves — visible in the dark sky above wave crests.
 * Wave SVG uses double-tile viewBox (780 × 380) for a seamless loop.
 */
function WaveBackground() {
  return (
    <div className="wave-bg" aria-hidden="true">
      {/* Stars — static, behind the wave SVG in DOM order */}
      <svg
        viewBox="0 0 390 380"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="wave-stars-svg"
      >
        {STARS.map(([cx, cy, r, opacity], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={opacity} />
        ))}
      </svg>

      {/* Waves — two seamless tiles, animated when flag is true */}
      <svg
        viewBox="0 0 780 380"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`wave-bg-svg${WAVE_ANIMATED ? ' wave-bg-svg--animated' : ''}`}
      >
        {/* Layer 1 — large deep swell */}
        <path
          d="M0 248 C65 165,160 305,195 248 C230 191,320 298,390 248
             C455 165,550 305,585 248 C620 191,710 298,780 248
             L780 380 L0 380 Z"
          fill="#191f37"
          opacity="0.65"
        />
        {/* Layer 2 — medium wave */}
        <path
          d="M0 285 C72 248,138 308,195 282 C252 256,318 302,390 282
             C462 256,528 308,585 282 C648 256,714 302,780 282
             L780 380 L0 380 Z"
          fill="#282d51"
          opacity="0.45"
        />
        {/* Layer 3 — subtle surface ripple */}
        <path
          d="M0 318 C88 302,158 330,230 318 C296 306,348 325,390 318
             C468 306,548 330,618 318 C684 306,738 325,780 318
             L780 380 L0 380 Z"
          fill="#3c3c6d"
          opacity="0.28"
        />
      </svg>
    </div>
  )
}

export default WaveBackground
