import { ColorPaletteArray } from "@/visualizations/ColorPalette";

export default function prepareLayout(element, options, data) {
  const layout = {
    margin: { l: 10, r: 10, b: 10, t: 25, pad: 4 },
    width: Math.floor(element.offsetWidth),
    height: Math.floor(element.offsetHeight),
    autosize: true,
    treemapcolorway: ColorPaletteArray,
  };
  return layout;
}
