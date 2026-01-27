export interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

export interface Book {
  _id: string;
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: {
    _id: string;
    username: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  books: Book[];
  currentPage: number;
  totalBooks: number;
  totalPages: number;
}
