import { registerVisualization } from "@/visualizations";

import getOptions from "../chart/getOptions";
import Renderer from "./Renderer";
import Editor from "./Editor";

export default function init() {
  registerVisualization({
    type: "TREEMAP",
    name: "Treemap",
    getOptions,
    Renderer,
    Editor,

    defaultRows: 8,
    minRows: 5,
  });
}

init.init = true;
