import { Timestamp } from "firebase/firestore/lite";

export interface CaValuationFormValues {
  productType?: string;
  productName?: string;
  taste?: number;
  spices?: number;
  cookingExperience?: number;
  receipeChoice?: string;
  packaging?: number;
  message?: string;
  total?: number;
  createdAt: Timestamp;
}

export interface CaContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface CaProduct {
  productId: string;
  title?: string;
  price: number;
  imageUrl?: string;
  additionalImages?: string[];
  description?: string;
  category?: string;
  createdAt?: Date;
}

export interface CaCartItem extends CaProduct {
  productId: string;
  quantity: number;
  totalPrice?: number;
  tax: number;
  delivery?: string;
}
