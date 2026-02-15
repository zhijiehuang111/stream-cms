/** Standard API success response */
export type ApiResponse<T> = {
  success: true;
  data: T;
};

/** Standard API error response */
export type ApiErrorResponse = {
  success: false;
  error: string;
};

/** Paginated list response */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Server Action result */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
