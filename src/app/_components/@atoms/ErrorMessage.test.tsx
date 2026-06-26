import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders the message", () => {
    render(<ErrorMessage message="Something failed" />);

    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  it("uses the error color class", () => {
    render(<ErrorMessage message="Something failed" />);

    expect(screen.getByText("Something failed")).toHaveClass("text-fail-base");
  });

  it("accepts extra classes", () => {
    render(<ErrorMessage message="Something failed" className="mb-4" />);

    expect(screen.getByText("Something failed")).toHaveClass("mb-4");
  });
});
