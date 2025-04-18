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

        // Semantic HSL vars mapping
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

        // Shades of main colors (for more nuanced design)
        emerald: {
          50: "#E6F0EB",
          100: "#CCE0D6",
          200: "#99C1AD",
          300: "#66A285",
          400: "#33835C",
          500: "#014421", // base
          600: "#01371A",
          700: "#012914",
          800: "#001C0D",
          900: "#000E07",
        },
        gold: {
          50: "#FFFBE6",
          100: "#FFF7CC",
          200: "#FFEF99",
          300: "#FFE766",
          400: "#FFDF33",
          500: "#FFD700", // base
          600: "#CCA900",
          700: "#997F00",
          800: "#665400",
          900: "#332A00",
        },
        grey: {
          50: "#F2F2F2",
          100: "#E6E6E6",
          200: "#CCCCCC",
          300: "#B3B3B3",
          400: "#999999",
          500: "#7F7F7F",
          600: "#666666",
          700: "#4D4D4D",
          800: "#333333", // close to gunmetal-grey
          900: "#1A1A1A", // lighter gunmetal
          950: "#0D0D0D", // midnight-black
        },
      },

      // Modern shadows for depth
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "accent-sm": "0 1px 3px rgba(255, 215, 0, 0.1)",
        accent: "0 4px 6px -1px rgba(255, 215, 0, 0.1)",
        "primary-sm": "0 1px 3px rgba(1, 68, 33, 0.2)",
        primary: "0 4px 6px -1px rgba(1, 68, 33, 0.1)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Animation keyframes
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
        "gradient-subtle":
          "linear-gradient(to bottom right, transparent 0%, transparent 80%, hsl(var(--deep-emerald) / 0.05) 100%)",
      },

      // Modern spacing scale
      spacing: {
        "4xs": "0.125rem", // 2px
        "3xs": "0.25rem", // 4px
        "2xs": "0.375rem", // 6px
        xs: "0.5rem", // 8px
        sm: "0.75rem", // 12px
        md: "1rem", // 16px
        lg: "1.25rem", // 20px
        xl: "1.5rem", // 24px
        "2xl": "2rem", // 32px
        "3xl": "2.5rem", // 40px
        "4xl": "3rem", // 48px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
