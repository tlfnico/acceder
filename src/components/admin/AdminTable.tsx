import React from "react";
import styles from "./AdminTable.module.css";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  isRowInactive?: (item: T) => boolean;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No se encontraron registros.",
  isRowInactive,
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isInactive = isRowInactive ? isRowInactive(item) : false;
            return (
              <tr
                key={keyExtractor(item)}
                className={isInactive ? styles.inactiveRow : undefined}
              >
                {columns.map((col, index) => (
                  <td key={index}>
                    {col.render
                      ? col.render(item)
                      : col.accessor
                      ? String(item[col.accessor] ?? "-")
                      : "-"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
