import Plotly from "plotly.js/lib/core";
import treemap from 'plotly.js/lib/treemap';

import prepareData from "./prepareData";
import prepareLayout from "./prepareLayout";
import updateData from "./updateData";
import applyLayoutFixes from "./applyLayoutFixes";

Plotly.register([treemap]);
Plotly.setPlotConfig({
  modeBarButtonsToRemove: ["sendDataToCloud"],
});

export {
  Plotly,
  prepareData,
  prepareLayout,
  updateData,
  applyLayoutFixes,
};
