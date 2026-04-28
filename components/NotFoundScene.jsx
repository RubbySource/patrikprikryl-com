'use client';

import { motion } from 'framer-motion';

export default function NotFoundScene() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <motion.svg
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3F1A" />
            <stop offset="100%" stopColor="#4A2410" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2D7D46" />
            <stop offset="100%" stopColor="#0D4A2A" />
          </linearGradient>
          <radialGradient id="soilGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#5C3A1F" />
            <stop offset="100%" stopColor="#2A1A0E" />
          </radialGradient>
        </defs>

        {/* Soft drop shadow under pot */}
        <ellipse cx="160" cy="288" rx="70" ry="6" fill="rgba(0,0,0,0.18)" />

        {/* Pot */}
        <motion.g
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M100 220 L220 220 L210 285 Q205 295 195 295 L125 295 Q115 295 110 285 Z"
            fill="url(#potGrad)"
          />
          <ellipse cx="160" cy="220" rx="60" ry="10" fill="#8C4A22" />
          <ellipse cx="160" cy="220" rx="55" ry="7" fill="url(#soilGrad)" />
        </motion.g>

        {/* Plant stem */}
        <motion.path
          d="M160 220 Q158 180 162 150 Q165 120 158 90"
          stroke="#2D7D46"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
        />

        {/* Leaf 1 — left */}
        <motion.g
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '158px 165px' }}
        >
          <path
            d="M158 165 Q120 150 105 175 Q115 195 145 192 Q155 188 158 165 Z"
            fill="url(#leafGrad)"
          />
          <path
            d="M158 165 Q135 175 120 184"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            fill="none"
          />
        </motion.g>

        {/* Leaf 2 — right */}
        <motion.g
          initial={{ scale: 0, rotate: 25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '162px 130px' }}
        >
          <path
            d="M162 130 Q200 110 220 138 Q210 162 178 158 Q168 152 162 130 Z"
            fill="url(#leafGrad)"
          />
          <path
            d="M162 130 Q185 138 205 145"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            fill="none"
          />
        </motion.g>

        {/* Leaf 3 — top, gentle sway */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          style={{ transformOrigin: '158px 92px' }}
        >
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '158px 92px' }}
          >
            <path
              d="M158 92 Q140 70 152 50 Q170 55 168 80 Q165 90 158 92 Z"
              fill="url(#leafGrad)"
            />
          </motion.g>
        </motion.g>

        {/* Butterfly — flies in arc */}
        <motion.g
          initial={{ x: 240, y: 60, opacity: 0 }}
          animate={{
            x: [240, 200, 230, 180, 210],
            y: [60, 90, 75, 110, 85],
            opacity: [0, 1, 1, 1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
            delay: 1.8,
          }}
        >
          {/* Butterfly body */}
          <ellipse cx="0" cy="0" rx="1" ry="5" fill="#1A1A1A" />
          {/* Left wing */}
          <motion.path
            d="M0 -2 Q-12 -10 -16 0 Q-12 6 -3 4 Z"
            fill="#1A56DB"
            animate={{ scaleX: [1, 0.4, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '0 0' }}
          />
          {/* Right wing */}
          <motion.path
            d="M0 -2 Q12 -10 16 0 Q12 6 3 4 Z"
            fill="#3B82F6"
            animate={{ scaleX: [1, 0.4, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '0 0' }}
          />
        </motion.g>

        {/* Floating "404" digits — like seeds drifting */}
        {[
          { char: '4', x: 60,  delay: 2.0, drift: -8 },
          { char: '0', x: 160, delay: 2.2, drift: 6  },
          { char: '4', x: 260, delay: 2.4, drift: -6 },
        ].map((d, i) => (
          <motion.text
            key={i}
            x={d.x}
            y={50}
            textAnchor="middle"
            fontFamily="Sora, sans-serif"
            fontWeight="800"
            fontSize="34"
            fill="#1A56DB"
            fillOpacity="0.18"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 0.18,
              y: [50, 50 + d.drift, 50],
            }}
            transition={{
              opacity: { delay: d.delay, duration: 0.6 },
              y: { delay: d.delay, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {d.char}
          </motion.text>
        ))}

        {/* Tiny ground sprouts */}
        {[80, 110, 240, 230].map((x, i) => (
          <motion.path
            key={`sprout-${i}`}
            d={`M${x} 295 Q${x - 2} 285 ${x} 278`}
            stroke="#2D7D46"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 2.0 + i * 0.1, duration: 0.6 }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
