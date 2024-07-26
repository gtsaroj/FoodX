export interface TableActions {
    editFn?: (id: string) => void;
    deleteFn?: (id: string) => void;
    viewFn?: (id: string) => void;
  }
  export interface ColumnProps {
    fieldName: string;
    colStyle?: React.CSSProperties;
    render?: (item: any) => React.ReactNode;
  }