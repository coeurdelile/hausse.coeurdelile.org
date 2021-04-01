module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#101316",
            h1: {
              marginTop: "1.4em",
              marginBottom: 0,
            },
            "h1,h2": {
              fontFamily: "Barlow",
              fontStyle: "italic",
              textTransform: "uppercase",
            },
            blockquote: {
              fontWeight: "normal",
              fontSize: "1.5em",
              borderLeftColor: "#111827",
              margin: 0,
              padding: "0 1.5em",
              border: "none",
              // hanging punctuation
              textIndent: "-0.4em",
            },
            hr: {
              width: "30%",
              marginLeft: "auto",
              marginRight: "auto",
              borderColor: "#101316",
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    //
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
