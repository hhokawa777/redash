/* eslint-disable react/prop-types */
import React from "react";
import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";

export default createTabbedEditor([
  {
    key: "General",
    title: "General",
    component: props => (
      <React.Fragment>
        <GeneralSettings {...props} />
      </React.Fragment>
    ),
  },
]);
