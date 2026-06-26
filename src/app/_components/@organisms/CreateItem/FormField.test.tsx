import { fireEvent, render, screen } from "@testing-library/react";
import FormField, { type FormControl } from "./FormField";
import type { FormState } from "./types";

const form: FormState = {
  itemNumber: "",
  itemName: "Mouse",
  UOM: "",
  price: "",
  cost: "",
  quantity: "",
  description: "Old text",
  locationId: "",
  leadTime: "",
};

const control = (setForm = jest.fn()): FormControl => ({ form, setForm });

describe("FormField", () => {
  it("renders an input field", () => {
    render(
      <FormField label="Nume articol" field="itemName" control={control()} />,
    );

    expect(screen.getByDisplayValue("Mouse")).toBeInTheDocument();
  });

  it("updates the selected form field", () => {
    const setForm = jest.fn();
    render(
      <FormField
        label="Nume articol"
        field="itemName"
        control={control(setForm)}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("Mouse"), {
      target: { value: "Keyboard" },
    });

    const update = setForm.mock.calls[0][0] as (
      current: FormState,
    ) => FormState;
    expect(update(form).itemName).toBe("Keyboard");
  });

  it("renders a textarea", () => {
    render(
      <FormField
        label="Descriere"
        field="description"
        control={control()}
        textarea
      />,
    );

    expect(screen.getByDisplayValue("Old text").tagName).toBe("TEXTAREA");
  });

  it("renders select options", () => {
    render(
      <FormField
        label="Locatie"
        field="locationId"
        control={control()}
        select
        options={[{ label: "Depot", value: "1" }]}
      />,
    );

    expect(screen.getByRole("option", { name: "Depot" })).toBeInTheDocument();
  });
});
