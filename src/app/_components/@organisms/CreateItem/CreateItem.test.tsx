import { render, screen } from "@testing-library/react";
import { CreateItem } from ".";

describe("CreateItem", () => {
  it("renders the create form title", () => {
    render(<CreateItem />);
    expect(screen.getByText("Articol nou")).toBeInTheDocument();
  });

  it("renders item name input", () => {
    render(<CreateItem />);
    expect(
      screen.getByPlaceholderText("Nume articol"),
    ).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<CreateItem />);
    expect(
      screen.getByRole("button", { name: "Adauga articol" }),
    ).toBeInTheDocument();
  });

});
