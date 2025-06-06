import React from "react";
import '../css/tableMap.css'; 

const Chair = () => <div className="chair" />;

function TableBox({ tableNum, tables, selectedTable, setSelectedTable }) {
  const table = tables.find((t) => t.tableNumber === tableNum);
  const isAvailable = !!table;
  const isSelected = selectedTable === table?._id;

  return (
    <div className="table-box">
      <Chair />
      <div
        className={`table-button ${
          !isAvailable
            ? "disabled"
            : isSelected
            ? "selected"
            : ""
        }`}
        onClick={() => isAvailable && setSelectedTable(table._id)}
      >
        {tableNum}
      </div>
      <Chair />
    </div>
  );
}

function TableRow({ tableNum, tables, selectedTable, setSelectedTable, isLarge }) {
  const table = tables.find((t) => t.tableNumber === tableNum);
  const isAvailable = !!table;
  const isSelected = selectedTable === table?._id;

  return (
    <div className="row-table">
      <div className="center">
        <Chair />
        <Chair />
        <Chair />
      </div>
      <div
        className={`table-center ${isLarge ? "large" : ""} ${
          !isAvailable
            ? "disabled"
            : isSelected
            ? "selected"
            : ""
        }`}
        onClick={() => isAvailable && setSelectedTable(table._id)}
      >
        שולחן {tableNum}
      </div>
      <div className="center">
        <Chair />
        <Chair />
        <Chair />
      </div>
    </div>
  );
}

export default function TableMap({ tables, selectedTable, setSelectedTable }) {
  return (
    <div className="table-map-wrapper">
      <div className="table-map">
        <div className="table-row">
          <TableBox tableNum={1} {...{ tables, selectedTable, setSelectedTable }} />
          <TableRow tableNum={2} {...{ tables, selectedTable, setSelectedTable }} />
          <TableBox tableNum={3} {...{ tables, selectedTable, setSelectedTable }} />
        </div>
        <div className="table-row">
          <TableBox tableNum={4} {...{ tables, selectedTable, setSelectedTable }} />
          <TableRow tableNum={5} {...{ tables, selectedTable, setSelectedTable }} />
          <TableBox tableNum={6} {...{ tables, selectedTable, setSelectedTable }} />
        </div>
        <div className="table-row">
          <TableBox tableNum={7} {...{ tables, selectedTable, setSelectedTable }} />
          <TableRow tableNum={8} isLarge {...{ tables, selectedTable, setSelectedTable }} />
          <TableBox tableNum={9} {...{ tables, selectedTable, setSelectedTable }} />
        </div>
      </div>
    </div>
  );
}
