export interface ProductType {
  id: string;
  name: string;
  category: string;
  prevId?: string | null;
  children: ProductType[];
  href?: string;
}
