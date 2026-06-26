import { render, screen } from "@testing-library/react";

const Hello = () => <div>Hello World</div>;

test("renders hello world", () => {
  render(<Hello />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
