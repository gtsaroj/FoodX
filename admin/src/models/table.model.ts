export interface TableActions {
  editFn?: (id: string) => void;
  deleteFn?: (id: string) => void;
  viewFn?: (id: string) => void;
}
export interface ColumnProps {
  fieldName: string | React.ReactNode;
  colStyle?: React.CSSProperties;
  render?: (item: any) => React.ReactNode;
}

export interface updateComponentProp {
  path?:"banners"| "sponsors"|string
  status?: string;
  id: string;
  closeModal?: (isOpen: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Table {
  export interface TableModalProps<T extends { id: string }> {
    data: T[];
    columns: string[];
    actionIconColor?: string;
    actions?: React.ReactNode[];
    bodyHeight?: string;
    disableActions?: boolean;
    disableNoData?: boolean;
    loading?: boolean;
    onPageChange?: (page: number) => void;
    pagination?: {
      perPage: number;
      currentPage: number;
    };
  }
}
