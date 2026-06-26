import { type ItemData, type FormState } from "./types";

export const createInitialFormState = (init?: ItemData): FormState => ({
  itemNumber: init ? init.itemNumber : "",
  itemName: init ? init.itemName : "",
  UOM: init ? init.UOM : "",
  price: init ? init.price.toString() : "0",
  cost: init ? init.cost.toString() : "0",
  quantity: init ? init.quantity.toString() : "0",
  description: init?.description ?? "",
  locationId: init?.locationId ? init.locationId.toString() : "",
  leadTime: init?.leadTime != null ? init.leadTime.toString() : "",
});

export const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
