import { Author } from "../Author";

export interface AuthorPaginatedResponse extends Response{
  data: {
    authors: Author[];
    totalPages: number;
    totalAuthors: number;
};
}

