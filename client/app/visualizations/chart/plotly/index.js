import { each, debounce, isArray, isObject } from 'lodash';

import Plotly from 'plotly.js/lib/core';
import bar from 'plotly.js/lib/bar';
import pie from 'plotly.js/lib/pie';
import histogram from 'plotly.js/lib/histogram';
import box from 'plotly.js/lib/box';
import heatmap from 'plotly.js/lib/heatmap';

import ImageDialog from './ImageDialog';

import {
  prepareData,
  prepareLayout,
  updateData,
  updateLayout,
  normalizeValue,
} from './utils';

Plotly.register([bar, pie, histogram, box, heatmap]);
Plotly.setPlotConfig({
  modeBarButtonsToRemove: ['sendDataToCloud'],
  modeBarButtonsToAdd: [[{
    name: 'Show image',
    icon: {
      width: 512,
      height: 512,
      path: 'M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z',
    },
    click: (gd) => {
      const toImageButtonOptions = gd._context.toImageButtonOptions;
      const opts = { format: toImageButtonOptions.format || 'png' };

      Plotly.toImage(gd, opts).then((dataUrl) => {
        ImageDialog.showModal({ src: dataUrl });
      });
    },
  }]],
});

const PlotlyChart = () => ({
  restrict: 'E',
  template: '<div class="plotly-chart-container" resize-event="handleResize()"></div>',
  scope: {
    options: '=',
    series: '=',
  },
  link(scope, element) {
    const plotlyElement = element[0].querySelector('.plotly-chart-container');
    const plotlyOptions = { showLink: false, displaylogo: false };
    let layout = {};
    let data = [];

    function update() {
      if (['normal', 'percent'].indexOf(scope.options.series.stacking) >= 0) {
        // Backward compatibility
        scope.options.series.percentValues = scope.options.series.stacking === 'percent';
        scope.options.series.stacking = 'stack';
      }

      data = prepareData(scope.series, scope.options);
      updateData(data, scope.options);
      layout = prepareLayout(plotlyElement, scope.series, scope.options, data);

      // It will auto-purge previous graph
      Plotly.newPlot(plotlyElement, data, layout, plotlyOptions).then(() => {
        updateLayout(plotlyElement, layout, (e, u) => Plotly.relayout(e, u));
      });

      plotlyElement.on('plotly_restyle', (updates) => {
        // This event is triggered if some plotly data/layout has changed.
        // We need to catch only changes of traces visibility to update stacking
        if (isArray(updates) && isObject(updates[0]) && updates[0].visible) {
          updateData(data, scope.options);
          Plotly.relayout(plotlyElement, layout);
        }
      });
    }
    update();

    scope.$watch('series', (oldValue, newValue) => {
      if (oldValue !== newValue) {
        update();
      }
    });
    scope.$watch('options', (oldValue, newValue) => {
      if (oldValue !== newValue) {
        update();
      }
    }, true);

    scope.handleResize = debounce(() => {
      updateLayout(plotlyElement, layout, (e, u) => Plotly.relayout(e, u));
    }, 50);
  },
});

const CustomPlotlyChart = clientConfig => ({
  restrict: 'E',
  template: '<div class="plotly-chart-container" resize-event="handleResize()"></div>',
  scope: {
    series: '=',
    options: '=',
  },
  link(scope, element) {
    if (!clientConfig.allowCustomJSVisualizations) {
      return;
    }

    const refresh = () => {
      // Clear existing data with blank data for succeeding codeCall adds data to existing plot.
      Plotly.newPlot(element[0].firstChild);

      try {
        // eslint-disable-next-line no-new-func
        const codeCall = new Function('x, ys, element, Plotly', scope.options.customCode);
        codeCall(scope.x, scope.ys, element[0].children[0], Plotly);
      } catch (err) {
        if (scope.options.enableConsoleLogs) {
          // eslint-disable-next-line no-console
          console.log(`Error while executing custom graph: ${err}`);
        }
      }
    };

    const timeSeriesToPlotlySeries = () => {
      scope.x = [];
      scope.ys = {};
      each(scope.series, (series) => {
        scope.ys[series.name] = [];
        each(series.data, (point) => {
          scope.x.push(normalizeValue(point.x));
          scope.ys[series.name].push(normalizeValue(point.y));
        });
      });
    };

    scope.handleResize = () => {
      refresh();
    };

    scope.$watch('[options.customCode, options.autoRedraw]', () => {
      refresh();
    }, true);

    scope.$watch('series', () => {
      timeSeriesToPlotlySeries();
      refresh();
    }, true);
  },
});

export default function init(ngModule) {
  ngModule.directive('plotlyChart', PlotlyChart);
  ngModule.directive('customPlotlyChart', CustomPlotlyChart);
}

init.init = true;
