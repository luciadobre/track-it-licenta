import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import AddressRowContent from "./AddressRowContent";

const renderAddressRow = (
  props?: Partial<ComponentProps<typeof AddressRowContent>>,
) =>
  render(
    <AddressRowContent
      name="Main"
      address="Street 1"
      isEditing={false}
      editForm={{ name: "", address: "" }}
      onEditChange={jest.fn()}
      onCommit={jest.fn()}
      onCancelEdit={jest.fn()}
      {...props}
    />,
  );

describe("AddressRowContent", () => {
  it("renders the read-only address", () => {
    renderAddressRow();

    expect(screen.getByText(/Main:/)).toBeInTheDocument();
    expect(screen.getByText(/Street 1/)).toBeInTheDocument();
  });

  it("renders edit inputs", () => {
    renderAddressRow({
      isEditing: true,
      editForm: { name: "Dock", address: "Street 2" },
    });

    expect(screen.getByDisplayValue("Dock")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Street 2")).toBeInTheDocument();
  });

  it("updates the name field", () => {
    const onEditChange = jest.fn();
    renderAddressRow({
      isEditing: true,
      editForm: { name: "Dock", address: "Street 2" },
      onEditChange,
    });

    fireEvent.change(screen.getByDisplayValue("Dock"), {
      target: { value: "Warehouse" },
    });

    expect(onEditChange).toHaveBeenCalledWith("name", "Warehouse");
  });

  it("commits on Enter", () => {
    const onCommit = jest.fn();
    renderAddressRow({
      isEditing: true,
      editForm: { name: "Dock", address: "Street 2" },
      onCommit,
    });

    fireEvent.keyDown(screen.getByDisplayValue("Dock"), { key: "Enter" });

    expect(onCommit).toHaveBeenCalledTimes(1);
  });
});
