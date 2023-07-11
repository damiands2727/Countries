import React from "react";
import { Link, MemoryRouter } from "react-router-dom";
import renderer, { create, act as renderAct } from "react-test-renderer";
import "../../sabioExpect";
import App from "../../../../App";
import Home from "../../../Home";
import SiteNav from "../../../SiteNav";
import { isEqual } from "lodash";

let expectedState = {
  firstName: "Unknown",
  lastName: "User",
  isLoggedIn: false,
};

let errObject = {
  emptyComponent:
    "You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
};

const statePropExists = (memoState, statePropName) => {
  let state = memoState?.memoizedState;
  if (!state) {
    return false;
  } else if (
    typeof state === "object" &&
    !Array.isArray(state) &&
    Object.keys(state).includes(statePropName)
  ) {
    return true;
  } else {
    return statePropExists(memoState?.next, statePropName);
  }
};

describe("App-Level State", () => {
  let appComponent;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    await renderAct(() => {
      appComponent = create(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  afterAll(() => {
    appComponent.unmount();
  });

  it("App: App.jsx should render without errors.", () => {
    let actualMsg;
    let expectedMsg = "App.jsx should render and have no errors.";
    try {
      renderer.create(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      actualMsg = expectedMsg;
    } catch (e) {
      e.message.includes(errObject.emptyComponent)
        ? (actualMsg =
            "App.jsx, or a component being imported into App.jsx, is not exported properly. Make sure all components are functional and exported correctly.")
        : (actualMsg = e.message);
    }
    expect(actualMsg).sabioToBe(expectedMsg, "Check your console for errors.");
  });

  it("App: There should be a state object called currentUser with the correct properties.", async () => {
    let hint;
    let appInstance = appComponent?.root?.findByType(App);

    let firstNamePropExists = statePropExists(
      appInstance?._fiber?.memoizedState,
      "firstName"
    );

    let lastNamePropExists = statePropExists(
      appInstance?._fiber?.memoizedState,
      "lastName"
    );

    let isLoggedInPropExists = statePropExists(
      appInstance?._fiber?.memoizedState,
      "isLoggedIn"
    );

    let actualMsg,
      expectedMsg =
        'The App component should have a currentUser state object with properties "firstName", "lastName", and "isLoggedIn".';

    actualMsg = expectedMsg;

    if (
      !!!firstNamePropExists ||
      !!!lastNamePropExists ||
      !isLoggedInPropExists
    ) {
      actualMsg =
        'The App component does not have a "currentUser" state object with properties "firstName", "lastName", and "isLoggedIn".';
      hint =
        'HINT: Make sure you are using the useState hook to create the "currentUser" state object.';
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it('App: App.jsx should pass a "user" prop to SiteNav.jsx with the correct state object.', () => {
    let hint, props, actualMsg;
    let expectedMsg = `A "user" prop should be passed from App.jsx to SiteNav.jsx. Its value should be the "currentUser" state object.`;
    let siteNavInstance = appComponent.root.findByType(SiteNav);
    if (siteNavInstance) {
      props = siteNavInstance.props;
      if (!!!props.user) {
        actualMsg = `A "user" prop was not passed. The prop(s) passed were: ${Object.keys(
          props
        ).join(", ")}`;
      } else if (props.user && !!!isEqual(props.user, expectedState)) {
        actualMsg = `The "user" prop was passed, but its value is incorrect. The value passed was:\n\n ${JSON.stringify(
          props.user
        )}`;
      } else {
        actualMsg = expectedMsg;
      }
    }
    hint = `HINT: Are you passing the "currentUser" object as the prop called "user"? Check that your prop is receiving these values:\n\n ${JSON.stringify(
      expectedState
    )}`;
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it('App: App.jsx should pass a "user" prop to Home.jsx with the correct state object.', () => {
    let hint, props, actualMsg;
    let expectedMsg = `A "user" prop should be passed from App.jsx to Home.jsx. Its value should be the "currentUser" state object.`;
    let siteNavInstance = appComponent.root.findByType(Home);
    if (siteNavInstance) {
      props = siteNavInstance.props;
      if (!!!props.user) {
        actualMsg = `A "user" prop was not passed. The prop(s) passed were: ${Object.keys(
          props
        ).join(", ")}`;
      } else if (props.user && !!!isEqual(props.user, expectedState)) {
        actualMsg = `The "user" prop was passed, but its value is incorrect. The value passed was:\n\n ${JSON.stringify(
          props.user
        )}`;
      } else {
        actualMsg = expectedMsg;
      }
    }
    hint = `HINT: Are you passing the "currentUser" object as the prop called "user"? Check that your prop is receiving these values:\n\n ${JSON.stringify(
      expectedState
    )}`;
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});

describe("Sending Props from App", () => {
  let appComponent;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    await renderAct(() => {
      appComponent = create(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  afterAll(() => {
    appComponent.unmount();
  });

  it('SiteNav.jsx should receive the correct "user" prop from App.jsx and display the first name and last name.', async () => {
    let component, actualMsg, hint, userProp;
    let expectedMsg =
      'SiteNav.jsx should receive the correct "user" prop from App.jsx and dynamically display the first name and last name.';

    component = renderer.create(
      <MemoryRouter>
        <SiteNav user={expectedState} />,
      </MemoryRouter>
    );

    let linkElements = component.root.findAllByType(Link);
    userProp = linkElements.find((l) => {
      let children = l.props.children;
      if (Array.isArray(children)) {
        return (
          children.includes(expectedState.firstName) &&
          children.includes(expectedState.lastName)
        );
      }
      return false;
    });

    if (!!userProp) {
      actualMsg = expectedMsg;
    } else {
      actualMsg = `The "user" prop was not rendered properly. Make sure you are passing the "user" prop to SiteNav.jsx and rendering the first and last name.`;
      hint = `HINT: Is your prop passed from App called "user"? Render the "firstName" and "lastName" properties where "Unknown User" was previously hardcoded.`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it('Home.jsx should receive the correct "user" prop from App.jsx and display the first name and last name inside an <h1>.', async () => {
    let component, actualMsg, hint, userProp;
    let expectedMsg =
      'Home.jsx should receive the correct "user" prop from App.jsx and dynamically display the first name and last name in an <h1>.';

    component = renderer.create(
      <MemoryRouter>
        <Home user={expectedState} />,
      </MemoryRouter>
    );

    let h1Elements = component.root.findAllByType("h1");
    userProp = h1Elements.find((h) => {
      let children = h.props.children;
      if (Array.isArray(children)) {
        return (
          children.includes(expectedState.firstName) &&
          children.includes(expectedState.lastName)
        );
      }
      return false;
    });

    if (!!userProp) {
      actualMsg = expectedMsg;
    } else {
      actualMsg = `The "user" prop was not rendered properly. Make sure you are passing the "user" prop to Home.jsx and rendering the first and last name in an <h1>.`;
      hint =
        `HINT: Is your prop passed from App called "user"? Render the "firstName" and "lastName" properties inside <h1></h1> tags.`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
