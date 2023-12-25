import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./src/**/*.{tsx,html}"],
  theme: {
    extend: {}
  },
  darkMode: "class",
  safeList: [
    {
      pattern: 'bg-[#{a-fA-F0-9]{3,6}]'
    },
    {
      pattern: 'text-[#{a-fA-F0-9]{3,6}]'
    }
  ]
})
