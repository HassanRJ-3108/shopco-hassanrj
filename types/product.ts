export interface Category {
  _id: string;
  name: string;
}

export interface Style {
  _id: string;
  name: string;
}

export interface Color {
  name: string;
  value: string;
}

export interface FAQ {
  question: string;
  answer: any[]; // This is of type 'any[]' because it's a Portable Text block
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
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
  productDetails: any[]; // This is of type 'any[]' because it's a Portable Text block
  faqs: FAQ[];
}

