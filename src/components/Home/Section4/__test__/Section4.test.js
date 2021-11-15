import React from "react";
import { render, cleanup } from "@testing-library/react";
import Section4 from "../Section4";
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

test("first testing in react", () => {
  const { getByTestId } = render(<Section4 />);
  const elem = getByTestId("header");

  expect(elem.textContent).toBe("با ما تماس بگیرید");
});
