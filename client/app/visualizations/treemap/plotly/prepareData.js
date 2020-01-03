import prepareTreemapData from "./prepareTreemapData";
import updateData from "./updateData";

export default function prepareData(seriesList, options) {
  return updateData(prepareTreemapData(seriesList, options), options);
}
