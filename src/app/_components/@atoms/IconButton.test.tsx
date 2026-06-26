import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import IconButton from "./IconButton";

const renderIconButton = ({
  children = "R",
  ...props
}: Partial<ComponentProps<typeof IconButton>> = {}) =>
  render(
    <IconButton label="Refresh" {...props}>
      {children}
    </IconButton>,
  );

describe("IconButton", () => {
  it("uses the label as accessible name", () => {
    renderIconButton();

    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("sets a matching title", () => {
    renderIconButton();

    expect(screen.getByTitle("Refresh")).toBeInTheDocument();
  });

  it("renders children", () => {
    renderIconButton({ children: <span>R</span> });

    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("calls onClick", () => {
    const onClick = jest.fn();
    renderIconButton({ onClick });

    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
