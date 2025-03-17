/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        typeLine1: {
          '0%': { strokeDasharray: '0 100', opacity: '1' },
          '10%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine2: {
          '0%, 10%': { strokeDasharray: '0 100', opacity: '1' },
          '20%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine3: {
          '0%, 20%': { strokeDasharray: '0 100', opacity: '1' },
          '30%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine4: {
          '0%, 30%': { strokeDasharray: '0 100', opacity: '1' },
          '40%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine5: {
          '0%, 40%': { strokeDasharray: '0 100', opacity: '1' },
          '50%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine6: {
          '0%, 50%': { strokeDasharray: '0 100', opacity: '1' },
          '60%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine7: {
          '0%, 60%': { strokeDasharray: '0 100', opacity: '1' },
          '70%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine8: {
          '0%, 70%': { strokeDasharray: '0 100', opacity: '1' },
          '80%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine9: {
          '0%, 80%': { strokeDasharray: '0 100', opacity: '1' },
          '90%': { strokeDasharray: '100 0', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        },
        typeLine10: {
          '0%, 90%': { strokeDasharray: '0 100', opacity: '1' },
          '100%': { strokeDasharray: '100 0', opacity: '1' }
        }
      },
      animation: {
        'type-1': 'typeLine1 20s linear infinite',
        'type-2': 'typeLine2 20s linear infinite',
        'type-3': 'typeLine3 20s linear infinite',
        'type-4': 'typeLine4 20s linear infinite',
        'type-5': 'typeLine5 20s linear infinite',
        'type-6': 'typeLine6 20s linear infinite',
        'type-7': 'typeLine7 20s linear infinite',
        'type-8': 'typeLine8 20s linear infinite',
        'type-9': 'typeLine9 20s linear infinite',
        'type-10': 'typeLine10 20s linear infinite'
      }
    },
  },
  plugins: [],
} 