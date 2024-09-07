/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "white"      : "#FFFFFF",
        "black"      : "#202020",
        "pink"       : "#FF004D",
        "purple"     : "#D300C5",
        "softGray"   : "#ECECEC",
        "yellow"     : "#FFD600",
        "softBlack"  : "#444444"
      },
      fontFamily: {
        'plT' : ['plT'],
        'plEL' : ['plEL'],
        'plL' : ['plL'],
        'plR' : ['plR'],
        'plM' : ['plM'],
        'plSB' : ['plSB'],
        'plB' : ['plB'],
        'plEB' : ['plEB'],
        'plBlack' : ['plBlack'],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}