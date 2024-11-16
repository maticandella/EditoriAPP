import { Author } from "./Author";

export interface Book {
    id: number,
    title: string;
    authorId: number;
    genreId: number;
    editionId: number;
    photo?: string;
    isbn: string;
    pagesNumber?: number;
    year?: number;
    review?: string;
    size?: number;
    price: number;
    author?: Author;
}