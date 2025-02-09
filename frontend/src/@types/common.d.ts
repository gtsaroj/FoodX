declare namespace Common {

  type folder = "users" | "products" | "banners";

  interface FetchPaginate<T>{
    pageSize: number;
    filter?: T;
    sort?: "asc" | "desc";
    currentFirstDoc?: any | null;
    currentLastDoc?: any | null;
    direction?: "prev" | "next";
  }
  interface TableModalProps<T> {
    data: Array<T>;
    totalData: number;
    selectedData?: Array<T>;
    columns: ColumnProps[];
    actions?: TableActions;
    loading?: boolean;
    headStyle?: React.CSSProperties;
    actionIconColor?: string;
    bodyHeight?: number;
    pagination?: {
      perPage?: number;
      currentPage?: number;
    };
    handlePageDirection: (direction: "prev" | "next") => void;
    disableNoData?: boolean;
    onPageChange?: (page: number) => void;
    disableActions?: boolean;
  }
  interface TableActions {
    orderFn?: (id: string) => void;
    checkAllFn?: (isChecked: boolean) => void;
    editFn?: (id: string) => void;
    deleteFn?: (id: string) => void;
    downloadFn?: (id: string) => void;
    viewFn?: (id: string) => void;
    checkFn?: (id: string, isChecked: boolean) => void;
  }
  interface ColumnProps<T> {
    fieldName: string | React.ReactNode;
    colStyle?: React.CSSProperties;
    render?: (item: T) => React.ReactNode;
  }

  interface TimeStamp {
    _seconds: number;
    _nanoseconds: number;
  }
}
