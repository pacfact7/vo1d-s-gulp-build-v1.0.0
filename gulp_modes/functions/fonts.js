const gulp = require('gulp'),
fs = require("fs"),
path = require("path");

function createFontStyles(fontsDir, fontsFile) {
   let fontStyles = ""; // Переменная для хранения стилей шрифтов

   const fontFiles = fs.readdirSync(fontsDir);
   for (let i = 0; i < fontFiles.length; i++) {
      const fontFileName = path.parse(fontFiles[i]).name;
      const fontName = fontFileName.split("-")[0] || fontFileName;
      const fontWeight = getFontWeight(fontFileName.split("-")[1] || "");
      fontStyles += `@font-face {\n\tfont-family: '${fontName}';\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\n\n`;
   }
   fs.writeFileSync(fontsFile, fontStyles);
   fontStyles = "";
   console.log(`Файл ${fontsFile} успешно обновлен.`);
}

function getFontWeight(fontWeight) {
   switch (fontWeight.toLowerCase()) {
      case "thin":
         return 100;
      case "extralight":
         return 200;
      case "light":
         return 300;
      case "medium":
         return 500;
      case "semibold":
         return 600;
      case "bold":
         return 700;
      case "extrabold":
      case "heavy":
         return 800;
      case "black":
         return 900;
      default:
         return 400;
   }
}

module.exports = { createFontStyles };