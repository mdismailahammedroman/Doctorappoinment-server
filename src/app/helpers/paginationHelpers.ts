// helpers/paginationHelpers.ts

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPageMeta {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

export const paginationHelpers = {
  calculatePagination(options: IPaginationOptions) {
   const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (Number(page) - 1) * limit;

    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: string = options.sortOrder || "desc";

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}
 }