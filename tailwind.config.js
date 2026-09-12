/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // These channel-color classes are composed dynamically (`bg-${channel.color}`,
  // often with an opacity modifier like `/10`) from src/data/channels.js, so
  // Tailwind's static content scan can't see them as literal strings — they're
  // safelisted here by pattern instead, including the variants we actually use.
  safelist: [
    {
      pattern: /^(bg|ring|text|border|from)-(circuit|ember|moss|clay)(\/(10|20|25|40|60|70|90))?$/,
      variants: ['hover', 'focus', 'dark', 'dark:hover']
    }
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'bg-subtle': 'rgb(var(--bg-subtle) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
        sale: 'rgb(var(--sale) / <alpha-value>)',
        // The spectrum: one accent per catalog channel. Used for wayfinding,
        // not decoration — see README > Design system.
        circuit: 'rgb(var(--c-circuit) / <alpha-value>)',
        ember: 'rgb(var(--c-ember) / <alpha-value>)',
        moss: 'rgb(var(--c-moss) / <alpha-value>)',
        clay: 'rgb(var(--c-clay) / <alpha-value>)',
        channel: 'rgb(var(--channel) / <alpha-value>)'
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      letterSpacing: {
        widest2: '0.22em'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--rot, 0deg))' }
        },
        dial: {
          '0%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
          '100%': { transform: 'rotate(-3deg)' }
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 -8px' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        pop: 'pop 0.35s ease-in-out',
        shimmer: 'shimmer 1.6s infinite linear',
        marquee: 'marquee 24s linear infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        scan: 'scan 0.6s linear infinite'
      }
    }
  },
  plugins: []
}
