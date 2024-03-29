import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./src/**/*.{tsx,html}"],
  theme: {
    extend: {}
  },
  darkMode: "class"
})
