import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        "midnight-black": "#0D0D0D",
        "gunmetal-grey": "#2C2C2C",
        "deep-emerald": "#014421",
        "royal-gold": "#FFD700",
        "platinum-silver": "#B0BEC5",
        "soft-white": "#E0E0E0",

        // Accent colors
        "crimson-red": "#D72638",
        "electric-lime": "#A8FF3E",
        "royal-blue": "#4169E1",

        // Legacy colors with new mappings for compatibility
        "neon-green": "#FFD700", // Mapped to royal-gold
        "neon-green-dark": "#014421", // Mapped to deep-emerald
        "neon-green-light": "#B0BEC5", // Mapped to platinum-silver
        "deep-black": "#0D0D0D", // Mapped to midnight-black
        "dark-gray": "#2C2C2C", // Mapped to gunmetal-grey
        "medium-gray": "#2C2C2C", // Mapped to gunmetal-grey
        "light-gray": "#B0BEC5", // Mapped to platinum-silver

        // HSL vars mapping
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background, var(--gunmetal-grey)))",
          foreground: "hsl(var(--sidebar-foreground, var(--soft-white)))",
          primary: "hsl(var(--sidebar-primary, var(--deep-emerald)))",
          "primary-foreground":
            "hsl(var(--sidebar-primary-foreground, var(--soft-white)))",
          accent: "hsl(var(--sidebar-accent, var(--royal-gold)))",
          "accent-foreground":
            "hsl(var(--sidebar-accent-foreground, var(--midnight-black)))",
          border: "hsl(var(--sidebar-border, var(--gunmetal-grey)))",
          ring: "hsl(var(--sidebar-ring, var(--deep-emerald)))",
        },
        // Cricket theme with new colors
        cricket: {
          dark: "hsl(var(--midnight-black))",
          medium: "hsl(var(--gunmetal-grey))",
          emerald: "hsl(var(--deep-emerald))",
          gold: "hsl(var(--royal-gold))",
          silver: "hsl(var(--platinum-silver))",
          white: "hsl(var(--soft-white))",
          red: "hsl(var(--crimson-red))",
          lime: "hsl(var(--electric-lime))",
          blue: "hsl(var(--royal-blue))",
        },
        badge: {
          gold: "hsl(var(--royal-gold))",
          emerald: "hsl(var(--deep-emerald))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            filter: "brightness(1)",
          },
          "50%": {
            opacity: "0.7",
            filter: "brightness(1.3)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
