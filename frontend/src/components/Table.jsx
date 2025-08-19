// components/Table.jsx
import React from "react";

const Table = ({ columns = [], data = [] }) => {
  return (
    <div className="rounded-2xl overflow-hidden mt-6 border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 last:border-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-6 text-sm text-[#6B7582]"
                  >
                    {/* if custom render function is provided use it, otherwise fallback */}
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
