import { configure, mount } from "enzyme";
import React from "react";
import PracticeAssessment from "../../components/codeChallenge/PracticeAssessment";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });

describe("React Practice Assessment", () => {
  let wrap;
  beforeEach(() => {
    wrap = mount(<PracticeAssessment />);
  });
  afterEach(() => {
    wrap.update();
  });

  it("The word 'Hello' is returned in a div. HINT: Make sure the word is capitalized.", () => {
    expect(wrap.text().includes("Hello")).toBe(true);
  });
});