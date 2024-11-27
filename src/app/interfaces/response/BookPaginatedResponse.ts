import { Book } from "../Book";

export interface BookPaginatedResponse extends Response{
  data: {
    items: Book[];
    totalPages: number;
    totalItems: number;
};
}