export type ProductCharacteristics = Record<
  string,
  string | string[] | number | null | undefined
> & {
  left_right_rus?: string | null;
  front_back_rus?: string | null;
  manufacturer?: string | null;
  mfrnumber?: string | null;
  partname_name?: string | null;
  comment?: string | null;
};

export interface Product {
  id: number;
  bazon_id: number;
  name: string;
  price: number;
  amount: number;
  type: string;
  category_slug?: string | null;
  pictures_urls: string[];
  characteristics: ProductCharacteristics;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
  total: number;
  last_page: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parent_slug?: string | null;
  sort_order: number;
}
