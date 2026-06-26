import { fireEvent, render, screen } from "@testing-library/react";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders a checkbox input", () => {
    render(<Checkbox />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("uses the checked value", () => {
    render(<Checkbox checked readOnly />);

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange when clicked", () => {
    const onChange = jest.fn();
    render(<Checkbox onChange={onChange} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("keeps custom class names", () => {
    render(<Checkbox className="absolute" />);

    expect(screen.getByRole("checkbox")).toHaveClass("absolute");
  });
});
