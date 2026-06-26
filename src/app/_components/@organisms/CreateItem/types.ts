export interface ItemData {
  id?: number;
  itemNumber: string;
  itemName: string;
  UOM: string;
  price: number;
  cost: number;
  quantity: number;
  description?: string;
  image?: string;
  locationId?: number;
  leadTime?: number | null;
}

export interface FormState {
  itemNumber: string;
  itemName: string;
  UOM: string;
  price: string;
  cost: string;
  quantity: string;
  description: string;
  locationId: string;
  leadTime: string;
}
