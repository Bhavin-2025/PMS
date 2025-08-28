import React, { useState } from "react";
import { Pagination } from "antd";

const Table = ({ columns = [], data = [], defaultPageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

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
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 last:border-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-2 py-4 text-sm text-[#6B7582]"
                  >
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

      {/* Pagination (always visible, bottom right) */}
      <div className="border border-gray-100"></div>
      <div className="flex justify-end py-2 px-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.length}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          hideOnSinglePage={false} // ✅ Always show pagination
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          onShowSizeChange={(page, size) => {
            setCurrentPage(1); // reset to first page when pageSize changes
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default Table;
