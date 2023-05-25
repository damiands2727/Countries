import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import "../../sabioExpect";
import { MemoryRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import SiteNav from "../../../SiteNav";

describe("Complete SiteNav Component:", () => {
  let siteNavRenderer, linkComponents;

  beforeAll(async () => {
    siteNavRenderer = renderer.create(
      <MemoryRouter>
        <SiteNav />
      </MemoryRouter>
    );
    linkComponents = siteNavRenderer.root.findAllByType(Link);
  });

  afterAll(() => {
    siteNavRenderer.unmount();
  }, 10000);

  it("SiteNav.jsx should be a functional component and render without errors.", () => {
    let actualMsg, isComp, hint;
    let expectedMsg = "SiteNav.jsx should render and have no errors.";
    try {
      isComp = typeof siteNavRenderer.root.type === "function";
      actualMsg = expectedMsg;
    } catch (e) {
      hint = `HINT: Make sure your SiteNav.jsx component is being exported and there are no errors.`;
      actualMsg = "SiteNav.jsx is not rendering properly.";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  //#region Home Link tests
  it("Link: Clicking Home should route the user to the Home page.", () => {
    let actualMsg, hint, links;

    let expectedMsg = `Home url path to be: "/"`;
    try {
      links = linkComponents.filter((l) => {
        let displayName = l.props.children;
        if (typeof displayName === "string") {
          displayName = displayName.toLowerCase();
        }
        return l.props.to === "/" && displayName === "home";
      });
      if (links.length === 0) {
        actualMsg = `The Link for Home is not set up properly or missing. Make sure "Home" is spelled correctly.`;
        hint = `HINT: Link to: "/"`;
      } else {
        actualMsg = expectedMsg;
      }
    } catch (e) {
      actualMsg = `The Link for Home is not set up properly or missing.`;
      hint = `HINT: Link to: "/"`;
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("Link: Clicking Unknown User should route the user to the Home page.", () => {
    let actualMsg, hint, links;

    let expectedMsg = `Unknown User url path to be: "/"`;
    try {
      links = linkComponents.filter((l) => {
        let displayName = l.props.children;
        if (typeof displayName === "string") {
          displayName = displayName.toLowerCase();
        }
        return (
          l.props.to === "/" &&
          (displayName === "unknown user" || displayName === "unknow user") //"Unknow User" is a typo in the video, so we are checking for both
        );
      });
      if (links.length === 0) {
        actualMsg = `The Link for Unknown User is not set up properly or missing. Make sure "Unknown User" is spelled and capitalized correctly.`;
        hint = `HINT: Link to: "/"`;
      } else {
        actualMsg = expectedMsg;
      }
    } catch (e) {
      actualMsg = `The Link for Unknown User is not set up properly or missing.`;
      hint = `HINT: Link to: "/"`;
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("Link: Clicking the Sabio icon should route the user to the Home page.", () => {
    let actualMsg, hint, links, isValidLink;

    let expectedMsg = `Sabio icon url path to be: "/"`;
    try {
      links = linkComponents.filter((l) => {
        let linkItem = l.props.children;
        if (typeof linkItem === "object") {
          linkItem = linkItem.props.src;
        }
        return (
          l.props.to === "/" &&
          linkItem === "https://pw.sabio.la/images/Sabio.png"
        );
      });
      if (links.length === 0) {
        actualMsg = `The Link for the Sabio icon is not set up properly or missing.`;
        hint = `HINT: Link to: "/"`;
      } else {
        actualMsg = expectedMsg;
      }
    } catch (e) {
      actualMsg = `The Link for the Sabio icon is not set up properly or missing.`;
      hint = `HINT: Link to: "/"`;
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  //#endregion

  //#region remaining Links tests
  const siteNavLinks = [
    { path: "/friends", displayName: "Friends" },
    { path: "/jobs", displayName: "Jobs" },
    { path: "/companies", displayName: "Tech Companies" },
    { path: "/events", displayName: "Events" },
    { path: "/test", displayName: "Test And Ajax Call" },
    { path: "/login", displayName: "Login" },
    { path: "/register", displayName: "Register" },
  ];

  siteNavLinks.forEach((link) => {
    it(`Link: Clicking ${link.displayName} should route the user to the ${link.displayName} page.`, () => {
      let actualMsg, hint, links, isValidLink;

      let expectedMsg = `${link.displayName} url path to be: "${link.path}"`;
      try {
        links = linkComponents.filter((l) => l.props.to === link.path);
        if (links.length === 0) {
          actualMsg = `The Link for ${link.displayName} is not set up properly or missing.`;
          hint = `HINT: Link to: "${link.path}"`;
        } else {
          isValidLink = links.every((targetLink) => {
            return (
              targetLink.props.children.toLowerCase() ===
              link.displayName.toLowerCase()
            );
          });
        }

        if (isValidLink) {
          actualMsg = expectedMsg;
        }
      } catch (e) {
        actualMsg = `The Link for ${link.displayName} is not set up properly or missing.`;
        hint = `HINT: Link to: "${link.path}"`;
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
  });
  //#endregion

  it("Links: There should be a total of 10 Links in your SiteNav component.", () => {
    let actualMsg, hint, linkCount;
    let allLinksExist = false;
    let expectedMsg =
      "There should be a total of 10 Links in the SiteNav component that are fully operational.";
    try {
      linkCount = linkComponents.length;
      if (linkCount === 10) {
        allLinksExist = true;
        actualMsg = expectedMsg;
      } else {
        actualMsg = `Only ${linkCount} out of 10 Links found.`;
        hint = "HINT: Are any of your above tests erroring? Fix those first.";
      }
    } catch (e) {
      actualMsg = `Only ${linkCount} out of 10 Links found.`;
      hint = "HINT: Are any of your above tests erroring? Fix those first.";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
