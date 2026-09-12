const pdfParse = require("pdf-parse");
async function trichXuatText(fileBuffer) {
  const file = await pdfParse(fileBuffer);
  return file.text;
}
module.exports = { trichXuatText };
