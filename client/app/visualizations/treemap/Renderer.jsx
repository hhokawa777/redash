import React from "react";
import { RendererPropTypes } from "@/visualizations";

import PlotlyChart from "./PlotlyChart";

export default function Renderer({ options, ...props }) {
  return <PlotlyChart options={options} {...props} />;
}

Renderer.propTypes = RendererPropTypes;
