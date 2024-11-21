import { Author } from "../Author";

export interface AuthorPaginatedResponse extends Response{
  data: {
    items: Author[];
    totalPages: number;
    totalItems: number;
};
}

