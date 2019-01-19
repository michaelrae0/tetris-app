function calcFontSize(widthScale, ratio) {
  let width = document.documentElement.clientWidth * widthScale;
  let fontSize = width*ratio;

  return fontSize;
}

export default {
  calcFontSize,
}