import React from "react";
import usersService from "../../../../services/usersService";
import "../../sabioExpect";
import { create, act as renderAct } from "react-test-renderer";
import Friends from "../../../friends/Friends";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
const https = require("https");

//for cookies to work propertly i unit tests
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.httpAgent = new https.Agent({ keepAlive: true });
  return config;
});

jest.setTimeout(10000); // 10 second timeout. If needed instructors can increase.

const filterCards = (div) =>
  div?.props?.className?.match(/\bcard\b/i) &&
  !div?.props?.className?.match(/\bcard-\b/i);

describe("Conditional Rendering", () => {
  let component;
  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    await renderAct(async () => {
      await usersService.login({
        email: "randomUser@user.com",
        password: "12ThisPassword!",
        tenantId: "TestUser",
      });
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
    await renderAct(() => {
      component = create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  afterAll(() => {
    component.unmount();
  });

  it("Friend cards are only rendered when the value of 'show' is true", async () => {
    let cards;
    let divs;

    divs = await component.root.findAllByType("div");
    cards = await divs.filter(filterCards);

    let actualMsg,
      expectedMsg = "No cards are rendered by default";
    actualMsg = expectedMsg;
    if (cards.length > 0) {
      actualMsg = "Cards are rendered by default";
    }

    expect(actualMsg).sabioToBe(
      expectedMsg,
      `HINT: Make sure you are only rendering the cards when show is true.`
    );
  });

  it("Friends.jsx should have a button with an id of 'show-friends'.", async () => {
    let buttons;
    let showButton = false;

    buttons = component.root.findAllByType("button");

    for (let button of buttons) {
      if (button.props.id === "show-friends") {
        showButton = true;
      }
    }
    let actualMsg,
      expectedMsg =
        "A button with an id of 'show-friends' exists on Friends.jsx";
    actualMsg = expectedMsg;
    if (!showButton) {
      actualMsg =
        "We could not find a button on the Friends.jsx component with the id 'show-friends'";
    }

    expect(actualMsg).sabioToBe(
      expectedMsg,
      "HINT: Make sure your button has an id with a value of 'show-friends' on it."
    );
  });

  it("Show Friends button has a clickHandler.", () => {
    let buttons;
    let clickHandler = false;
    buttons = component.root.findAllByType("button");
    for (let button of buttons) {
      if (
        button.props.id === "show-friends" &&
        typeof button.props.onClick === "function"
      ) {
        clickHandler = true;
      }
    }
    let actualMsg,
      expectedMsg = "Show Friends button has a clickHandler";
    actualMsg = expectedMsg;
    if (!clickHandler) {
      actualMsg = "Show Friends button does not have a clickHandler";
    }

    expect(actualMsg).sabioToBe(
      expectedMsg,
      "HINT: Make sure your Show Friends button has a clickHandler on it."
    );
  });

  it("When Show Friends button is clicked, should render the list of friends as 'card' elements", async () => {
    let buttons;
    let showButton;
    let cards;
    let divs;
    let hint;
    let actualMsg,
      expectedMsg = "Show Friends button renders friends to the DOM";
    actualMsg = expectedMsg;

    buttons = component.root.findAllByType("button");
    for (let button of buttons) {
      if (button.props.id === "show-friends") {
        showButton = button;
      }
    }

    await renderAct(async () => {
      if (showButton) {
        if (showButton.props.onClick) {
          await showButton.props.onClick();
        } else {
          actualMsg = "Show Friends button does not have a clickHandler";
          hint =
            "HINT: Make sure your Show Friends button has a clickHandler on it.";
        }
      } else {
        actualMsg = "Show Friends button does not exist on Friends.jsx";
        hint =
          "HINT: Make sure your button has the correct id of 'show-friends'";
      }
    });

    divs = await component.root.findAllByType("div");

    cards = await divs.filter(filterCards);

    let cardsHaveDNone = false;
    for (let card of cards) {
      if (card?.props?.className.includes("d-none") || card?.props?.style) {
        cardsHaveDNone = true;
      }
    }

    if (!cards.length > 0 || cardsHaveDNone) {
      if (cardsHaveDNone) {
        actualMsg =
          "Show Friends button does not render friends to the DOM via conditional rendering;";
        hint =
          "Cards on DOM should not have a class of d-none or a display: 'none' style tag`";
      } else {
        actualMsg = `After clicking Show Friends button no friends cards are rendered to the DOM.`;
        hint =
          "HINT: Make sure you are rendering the cards to the DOM when show is true.";
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("When Show Friends is clicked again, it should remove the friend cards from the DOM", async () => {
    let cards;
    let divs;
    let buttons;
    let showButton;
    let hint;
    let actualMsg,
      expectedMsg =
        "No friends should be rendered after clicking Show Friends button a second time";
    actualMsg = expectedMsg;

    divs = await component.root.findAllByType("div");

    cards = await divs.filter(filterCards);

    buttons = component.root.findAllByType("button");
    for (let button of buttons) {
      if (button.props.id === "show-friends") {
        showButton = button;
      }
    }

    await renderAct(async () => {
      if (showButton) {
        if (cards.length > 0) {
          await showButton.props.onClick();
        } else {
          actualMsg =
            "Friends should be rendered to the DOM after clicking Show Friends button the first time. Currently they are not.";
          hint =
            "HINT: Make sure you are rendering the cards to the DOM when show is true.";
        }
      } else {
        actualMsg = "Show Friends button does not exist on Friends.jsx";
        hint =
          "HINT: Make sure your button has the correct id of 'show-friends'";
      }
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });

    divs = await component.root.findAllByType("div");

    cards = await divs.filter(filterCards);

    if (cards.length > 0) {
      actualMsg =
        "Friends are still rendered after clicking Show Friends button a second time";
      hint = `HINT: Make sure you are updating the value of "show" correctly when Show Friends button is clicked.`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
