import { SorterResult } from "antd/es/table/interface"

export type SortData<TData> = {
  data?: SorterResult<TData>
  onChange: (sortData?: SorterResult<TData>) => void
}
