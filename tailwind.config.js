module.exports = {
  content: ["./src/**/*.{tsx,css}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#101316",
            // h1: {
            //   marginTop: "1.4em",
            //   marginBottom: 0,
            // },
            h1: {
              fontFamily: "Barlow Black",
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
  plugins: [
    // hey prettier please put this on multiple lines thx
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
