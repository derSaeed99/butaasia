import { Timestamp } from "firebase/firestore/lite";

export type Valuations = {
  valuationId: string;
  productType?: string;
  productName?: string;
  taste?: number;
  spices?: number;
  cookingExperience?: number;
  receipeChoice?: string;
  packaging?: number;
  message?: string;
  total?: number;
  createdAt?: Timestamp;
};
