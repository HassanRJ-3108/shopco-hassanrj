export interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  imageUrl?: string;
}

export interface Style {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
}

export interface Color {
  _id: string;
  name: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Review {
  _id: string;
  rating: number;
  content: string;
  createdAt: string;
  isVerified: boolean;
  customer?: {
    name: string;
    email: string;
  };
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  description: string;
  images: string[];
  colors: Color[];
  sizes: string[];
  category: Category;
  style: Style;
  inventory: number;
  slug: {
    current: string;
  };
  productDetails: string[];
  faqs: FAQ[];
  isNewArrival?: boolean;
  isTopSelling?: boolean;
  tags?: string[];
  createdAt: string;
  reviews: Review[];
}

