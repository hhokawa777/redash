import { isArray, map, includes, each, difference } from "lodash";
import React, { useMemo } from "react";
import { UpdateOptionsStrategy } from "@/components/visualizations/editor/createTabbedEditor";
import { EditorPropTypes } from "@/visualizations";

import ColumnMappingSelect from "./ColumnMappingSelect";

function getMappedColumns(options, availableColumns) {
  const mappedColumns = {};
  const availableTypes = ["y", "x"];
  each(availableTypes, type => {
    mappedColumns[type] = ColumnMappingSelect.MappingTypes[type].multiple ? [] : null;
  });

  availableColumns = map(availableColumns, c => c.name);
  const usedColumns = [];

  each(options.columnMapping, (type, column) => {
    if (includes(availableColumns, column) && includes(availableTypes, type)) {
      const { multiple } = ColumnMappingSelect.MappingTypes[type];
      if (multiple) {
        mappedColumns[type].push(column);
      } else {
        mappedColumns[type] = column;
      }
      usedColumns.push(column);
    }
  });

  return {
    mappedColumns,
    unusedColumns: difference(availableColumns, usedColumns),
  };
}

function mappedColumnsToColumnMappings(mappedColumns) {
  const result = {};
  each(mappedColumns, (value, type) => {
    if (isArray(value)) {
      each(value, v => {
        result[v] = type;
      });
    } else {
      if (value) {
        result[value] = type;
      }
    }
  });
  return result;
}

export default function GeneralSettings({ options, data, onOptionsChange }) {
  const { mappedColumns, unusedColumns } = useMemo(() => getMappedColumns(options, data.columns), [
    options,
    data.columns,
  ]);

  function handleColumnMappingChange(column, type) {
    const columnMapping = mappedColumnsToColumnMappings({
      ...mappedColumns,
      [type]: column,
    });
    onOptionsChange({ columnMapping }, UpdateOptionsStrategy.shallowMerge);
  }

  return (
    <React.Fragment>
      {map(mappedColumns, (value, type) => (
        <ColumnMappingSelect
          key={type}
          type={type}
          value={value}
          availableColumns={unusedColumns}
          onChange={handleColumnMappingChange}
        />
      ))}
    </React.Fragment>
  );
}

GeneralSettings.propTypes = EditorPropTypes;
