export interface Book {
  id: string;
  title: string;
  authors: string[];
  pages: number;
  publish_year: number;
  created_at: string;
  cover_url?: string; 
  isbn?: string;      
}

export interface BookCreate {
  title: string;
  authors: string[];
  pages: number;
  publish_year: number;
  cover_url?: string;
  isbn?: string;
}

export interface BookUpdate {
  title?: string;
  authors?: string[];
  pages?: number;
  publish_year?: number;
  cover_url?: string;
  isbn?: string;
}

export interface BookListResponse {
  books: Book[];
  total: number;
}

export interface BookFormData {
  title: string;
  authors: string;
  pages: string;
  publish_year: string;
  cover_url?: string;
  isbn?: string;
}
