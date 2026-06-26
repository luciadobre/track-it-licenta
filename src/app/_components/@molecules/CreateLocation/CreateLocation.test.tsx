import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateLocation } from "./index";

const renderCreateLocation = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CreateLocation />
    </QueryClientProvider>,
  );

describe("CreateLocation", () => {
  it("renders name input", () => {
    renderCreateLocation();

    expect(screen.getByPlaceholderText("Nume locatie")).toBeInTheDocument();
  });

  it("renders address input", () => {
    renderCreateLocation();

    expect(screen.getByPlaceholderText("Adresa")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderCreateLocation();

    expect(
      screen.getByRole("button", { name: /Adauga locatia/i }),
    ).toBeInTheDocument();
  });

});
