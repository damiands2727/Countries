import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "../../sabioExpect";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import App from "../../../../App";
import Footer from "../../../Footer";
import Login from "../../../user/Login";
import SiteNav from "../../../SiteNav";
import Home from "../../../Home";
import TestAndAjax from "../../../TestAndAjax";
import Friends from "../../../friends/Friends";
import Jobs from "../../../jobs/Jobs";
import Companies from "../../../techcompanies/Companies";
import Events from "../../../events/Events";
import Register from "../../../user/Register";

jest.setTimeout(20000);

let errObject = {
  emptyComponent:
    "You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
};

const routeComponents = [
  {
    route: "Home",
    to: "/",
    element: <Home />,
    elementString: "<Home />",
    comp: Home,
    fileName: "Home.jsx",
  },
  {
    route: "Friends",
    to: "/friends",
    element: <Friends />,
    elementString: "<Friends />",
    comp: Friends,
    fileName: "Friends.jsx",
  },
  {
    route: "Jobs",
    to: "/jobs",
    element: <Jobs />,
    elementString: "<Jobs />",
    comp: Jobs,
    fileName: "Jobs.jsx",
  },
  {
    route: "TechCompanies",
    to: "/companies",
    element: <Companies />,
    elementString: "<Companies />",
    comp: Companies,
    fileName: "Companies.jsx",
  },
  {
    route: "Events",
    to: "/events",
    element: <Events />,
    elementString: "<Events />",
    comp: Events,
    fileName: "Events.jsx",
  },
  {
    route: "TestAndAjax",
    to: "/test",
    element: <TestAndAjax />,
    elementString: "<TestAndAjax />",
    comp: TestAndAjax,
    fileName: "TestAndAjax.jsx",
  },
  {
    route: "Login",
    to: "/login",
    element: <Login />,
    elementString: "<Login />",
    comp: Login,
    fileName: "Login.jsx",
  },
  {
    route: "Register",
    to: "/register",
    element: <Register />,
    elementString: "<Register />",
    comp: Register,
    fileName: "Register.jsx",
  },
];

const appRenderedComponents = [
  {
    element: <SiteNav />,
    comp: SiteNav,
    fileName: "SiteNav.jsx",
  },
  {
    element: <Footer />,
    comp: Footer,
    fileName: "Footer.jsx",
  },
];

describe("Setting Up Basic Routing - Components", () => {
  afterEach(() => {
    cleanup();
  });
  it("App.jsx should be a functional component and render without errors.", () => {
    let actualMsg, component;
    let isComp;
    let expectedMsg = "App.jsx should render and have no errors";
    try {
      component = renderer.create(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      isComp = typeof component.root.type === "function";
      actualMsg = expectedMsg;
    } catch (e) {
      e.message.includes(errObject.emptyComponent)
        ? (actualMsg =
            "App.jsx, or a component being imported into App.jsx, is not exported properly. Make sure all components are exported correctly.")
        : (actualMsg = e.message);
    }
    expect(actualMsg).sabioToBe(expectedMsg, "Check your console for errors.");
  });

  appRenderedComponents.forEach(({ fileName }) => {
    it(`Rendered Components: ${fileName} is imported and rendered in App.jsx.`, () => {
      let actualMsg, hint, component;
      let expectedMsg = `${fileName} to be imported and rendering without errors.`;
      try {
        component = renderer.create(
          <MemoryRouter>
            <App />
          </MemoryRouter>
        );
        actualMsg = expectedMsg;
      } catch (e) {
        hint = `HINT: Make sure to import the component before trying to render it.`;
        e.message.includes(errObject.emptyComponent)
          ? (actualMsg =
              "a component being imported is not exported properly. Make sure all components are exported correctly.")
          : (actualMsg = `${fileName} is not being imported or rendered properly in App.jsx`);
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
  });

  it("Components: Footer.jsx should include the <footer> element.", () => {
    let actualMsg, hint, footerElement, container;
    let expectedMsg = "<footer></footer> to be within Footer.jsx";
    try {
      container = renderer.create(<Footer />);
      footerElement = container.root.findByType("footer");
      actualMsg = expectedMsg;
    } catch (e) {
      if (e.message.includes(errObject.emptyComponent)) {
        actualMsg =
          "A component being imported is not exported properly. Make sure all components are exported correctly.";
      } else {
        actualMsg = `<footer> element is not found`;
        hint = `HINT: <footer></footer> is required to be rendered in Footer.jsx.`;
      }
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("Components: SiteNav.jsx should include the <nav> element.", () => {
    let actualMsg, hint, navElement, container;
    let expectedMsg = "<nav></nav> to be within SiteNav.jsx";
    try {
      container = renderer.create(
        <MemoryRouter>
          <SiteNav />
        </MemoryRouter>
      );
      navElement = container.root.findByType("nav");
      actualMsg = expectedMsg;
    } catch (e) {
      if (e.message.includes(errObject.emptyComponent)) {
        actualMsg =
          "A component being imported is not exported properly. Make sure all components are exported correctly.";
      } else {
        actualMsg = "<nav> element is not found.";
        hint = "HINT: <nav></nav> is required to be rendered in SiteNav.jsx.";
      }
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("Components: TestAndAjax.jsx should have the correct html.", async () => {
    let actualMsg, container, includesHtml, hint;
    let expectedMsg =
      " TestAndAjax.jsx should include the html from App.jsx. The parent element should be <main> with the role of main.";
    try {
      container = renderer.create(<TestAndAjax />);
      includesHtml = container.root.findByType("main");
      actualMsg = expectedMsg;
    } catch (error) {
      if (e.message.includes(errObject.emptyComponent)) {
        actualMsg =
          "A component being imported is not exported properly. Make sure all components are exported correctly.";
      } else {
        actualMsg = "The correct html is not found in TestAndAjax.jsx";
        hint =
          "Grab the html from App.jsx, starting with the parent element <main> with the role of main.";
      }
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  routeComponents.forEach(({ fileName, element }) => {
    it(`Components: ${fileName} should render without errors and return an <h1> element with the component name.`, () => {
      let actualMsg, hint, container, expectedMsg, includesH1;
      expectedMsg = `${fileName} to render without errors and return an <h1> element with the component name.`;
      try {
        container = renderer.create(element);
        includesH1 = container.root.findByType("h1");
        actualMsg = expectedMsg;
      } catch (e) {
        if (e.message.includes(errObject.emptyComponent)) {
          actualMsg =
            "A component being imported is not exported properly. Make sure all components are exported correctly.";
        } else {
          actualMsg = "<h1> element is not found.";
          hint = `HINT: <h1></h1> is required to be rendered in ${fileName}.`;
        }
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
  });
});

describe("Setting Up Basic Routing - Routes", () => {
  afterEach(() => {
    cleanup();
  });

  routeComponents.forEach(({ route, to, elementString, comp }) => {
    it(`Routes: App.jsx should have a route for ${route}.`, () => {
      let component, actualMsg, currentRoute;
      let isRoute = false;
      let expectedMsg = `${route} route path to be set to ${to}.`;
      let hint = `HINT: The path for ${route} component should be "${to}" and the element should be ${elementString}`;
      try {
        component = renderer.create(
          <MemoryRouter initialEntries={[to]}>
            <App />
          </MemoryRouter>
        );
        currentRoute = component.root.findByType(comp);
        isRoute = typeof component.root.type === "function";
        actualMsg = expectedMsg;
      } catch (e) {
        actualMsg = `${route} route is not set up properly or missing.`;
        isRoute = false;
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
  });
});
