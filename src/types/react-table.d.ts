/* eslint-disable @typescript-eslint/no-unused-vars */
import '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<_TData extends RowData, _TValue> {
    label?: string;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
