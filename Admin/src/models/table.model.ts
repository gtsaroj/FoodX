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
  status?: string;
  id: string;
  closeModal?: (isOpen: boolean) => void;
}
