export interface authState {
  loading: boolean;
  userInfo: any[]  | null;
  error: boolean;
  success: boolean;
}

export interface ImageFolders {
  folder: "users" | "products" | "banners";
}

export interface DbUser {
  avatar: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  refreshToken: string;
  uid: string;
  role?: "admin" | "customers";
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
    },
  }
}
