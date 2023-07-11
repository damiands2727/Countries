import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "../../../../App";
import Friends from "../../../friends/Friends";
import renderer, { act as renderAct } from "react-test-renderer";
import "../../sabioExpect";
import * as starterHelper from "../../starterHelper";
import axios from "axios";
import https from "https";

describe("Rendering from a static list.", () => {
  let component;
  const friendProps = [
    "id",
    "bio",
    "title",
    "summary",
    "headline",
    "entityTypeId",
    "statusId",
    "slug",
    "skills",
    "primaryImage",
    "dateCreated",
    "dateModified",
  ];

  const getArraysInObject = (obj, arrs = [], visited = new Set()) => {
    if (obj) {
      if (visited.has(obj)) {
        return arrs;
      }
      visited.add(obj);

      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
          arrs.push(obj[key]);
        } else if (typeof obj[key] === "object") {
          getArraysInObject(obj[key], arrs, visited);
        }
      });
    }

    return arrs;
  };

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    axios.interceptors.request.use((config) => {
      config.withCredentials = true;
      config.httpAgent = new https.Agent({ keepAlive: true });
      return config;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    component?.unmount();
  });

  it("01 - Friends cards should exist in Friends.jsx component, not App.jsx.", async () => {
    let expectedMsg, actualMsg, hint, friendInstance;
    expectedMsg = "Friends.jsx was found at the '/friends' route.";
    let routeIsIncluded = false;
    let routeIsNotIncluded = false;
    try {
      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter initialEntries={["/friends"]}>
            <App />
          </MemoryRouter>
        );
      });

      friendInstance = component?.root?.findAll(
        starterHelper.elementByType(Friends)
      );
      if (friendInstance && friendInstance.length !== 0) {
        routeIsIncluded = true;
      }
      component.unmount();

      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter>
            <App />
          </MemoryRouter>
        );
      });

      friendInstance = component?.root?.findAll(
        starterHelper.elementByType(Friends)
      );
      if (friendInstance && friendInstance.length !== 0) {
        routeIsNotIncluded = true;
      }

      if (routeIsIncluded && !routeIsNotIncluded) {
        actualMsg = expectedMsg;
      } else if (routeIsIncluded && routeIsNotIncluded) {
        actualMsg = "You are rendering Friends.jsx directly in App.jsx";
      } else {
        actualMsg = "Friends.jsx was not found at the '/friends' route";
        hint =
          "HINT: Make sure you named your component Friends.jsx and that it is rendered at the '/friends' route.";
      }
    } catch (error) {
      actualMsg = "Your Friends component won't render.";
      hint = "Check for errors in your code.";
    }
    component.unmount();
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("02 - The 'Friends' component is a functional component.", async () => {
    let actualMsg,
      expectedMsg = `You are using a 'Functional' component.`;

    await renderAct(() => {
      component = renderer.create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
    });

    let isClassComp = component?.root?.find(
      starterHelper.elementByType(Friends)
    );

    if (isClassComp._fiber.elementType.toString().split(" ")[0] === "class") {
      actualMsg = `You are using a 'Class' component and you should be using a 'Functional' component for Friends.jsx.`;
    } else {
      actualMsg = expectedMsg;
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });

  it("03 - Friends.jsx has a route in App.jsx.", async () => {
    let testInstance;
    let hint = "";

    await renderAct(() => {
      component = renderer.create(
        <MemoryRouter initialEntries={["/friends"]}>
          <App />
        </MemoryRouter>
      );
    });
    const expectedMsg = `The Friends Component exists. And there is a route for it in App.jsx.`;
    let actualMsg = expectedMsg;
    try {
      testInstance = component?.root?.find(
        starterHelper.elementByType(Friends)
      );

      if (!testInstance) {
        actualMsg = `The Friends Component does not exist, or you don't have a route for it in App.jsx.`;
        hint = `HINT: Make sure you are including a route to /friends inside your App.jsx component.`;
      }
    } catch {
      actualMsg = `The Friends Component does not exist, or you don't have a route for it in App.jsx.`;
      hint = `HINT: Make sure you are including a route to /friends inside your App.jsx component.`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("04 - useState hook is being implemented in Friends.", async () => {
    const expectedMsg =
      "You are importing and implementing the 'useState' hook " +
      "and your state contains an array with at least one friend.";
    let actualMsg = expectedMsg;
    let hint = "";

    let usingUseState = false;

    await renderAct(() => {
      component = renderer.create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
    });

    let friendsInstance = component?.root?.find(
      starterHelper.elementByType(Friends)
    );
    if (!!friendsInstance) {
      if (!!friendsInstance?._fiber?._debugHookTypes) {
        usingUseState =
          friendsInstance?._fiber?._debugHookTypes?.includes("useState");
      }
    }

    if (!usingUseState) {
      actualMsg = "'useState' hook was not found in Friends.jsx.";
      hint = `HINT: Make sure you are importing the 'useState' and using it inside Friends.jsx.`;
    } else {
      let memoState = friendsInstance?._fiber?.memoizedState;
      let stateArrs = [];
      const memoStates = starterHelper.getMemoStates(memoState);

      if (memoStates.length === 0) {
        actualMsg = "You are not correctly implementing the useState hook.";
        hint =
          "HINT: Make sure you are setting your array of friends as the initial " +
          "value on the state of your Friends component.";
      } else {
        memoStates.forEach((state) => {
          let newArr = [];
          if (typeof state === "object") {
            newArr = getArraysInObject(state);
          } else if (Array.isArray(state)) {
            newArr = state;
          }
          stateArrs = stateArrs.concat(newArr);
        });
        let hasFriendsArr;
        for (let i = 0; i < stateArrs.length; i++) {
          const stateArr = stateArrs[i];
          hasFriendsArr = stateArr.every((item) => {
            const itemKeys = Object.keys(item);
            return friendProps.every((prop) => itemKeys.includes(prop));
          });
          if (hasFriendsArr) {
            break;
          }
        }
        if (!hasFriendsArr) {
          actualMsg =
            "One or more of the friends from the array in your state " +
            "is missing one or more of the required properties.";
          hint =
            "HINT: Make sure all the friends in the array have the following properties: " +
            "'id', 'bio', 'title', 'summary', 'headline', 'entityTypeId', 'statusId', 'slug', " +
            "'skills', 'primaryImage', 'dateCreated', 'dateModified'.";
        }
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("05 - All friends on the static list are being rendered as cards.", async () => {
    const expectedMsg = "All your friends are being rendered on the DOM.";
    let actualMsg = expectedMsg;
    let cards;
    let hint = "";

    await renderAct(() => {
      component = renderer.create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
    });

    let friendsInstance = component?.root?.find(
      starterHelper.elementByType(Friends)
    );

    let divs = friendsInstance?.findAllByType("div");

    cards = divs?.filter(starterHelper.filterCards);

    if (cards.length > 0) {
      let memoState = friendsInstance?._fiber?.memoizedState;
      let friendsArr = [];
      const memoStates = starterHelper.getMemoStates(memoState);

      for (let i = 0; i < memoStates.length; i++) {
        const state = memoStates[i];
        let stateArr, isFriendArr;
        if (typeof state === "object") {
          stateArr = getArraysInObject(state)[0];
        } else if (Array.isArray(state)) {
          stateArr = state;
        }
        isFriendArr = stateArr?.every((item) => {
          const itemKeys = Object.keys(item);
          return friendProps.every((prop) => itemKeys.includes(prop));
        });
        if (isFriendArr) {
          friendsArr = stateArr;
          break;
        }
      }
      if (friendsArr.length !== cards.length) {
        actualMsg = `We found ${friendsArr.length} friends but ${cards.length} cards were rendered.`;
        hint =
          "HINT: Make sure you are mapping through the array of friends " +
          "in your state for rendering the cards.";
      }
    } else {
      actualMsg = "No friend cards found on the DOM.";
      hint =
        "HINT: Remember to add an static array with the information you get from Postman " +
        "and to map through it to render the cards.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("06 - The cards should have key that starts with 'ListA-' and they are all uniques.", async () => {
    let firstCardId;
    let secondCardId;
    let hint = "";
    let actualMsg,
      expectedMsg =
        "The template card should have a key that starts with 'ListA-' and they are all unique.";

    await renderAct(() => {
      component = renderer.create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
    });
    let divs = component?.root?.findAllByType("div");
    let cards = divs?.filter(starterHelper.filterCards);
    if (cards.length > 0) {
      firstCardId = cards[0]?._fiber?.key;

      secondCardId = cards[1]?._fiber?.key;

      if (!!firstCardId) {
        if (firstCardId.includes("ListA-")) {
          let uniqueKeyVal = firstCardId.split("-")[1];
          if (!!uniqueKeyVal && uniqueKeyVal !== "undefined") {
            actualMsg = expectedMsg;
          } else {
            actualMsg = `The returned value from the key is coming back as undefined.`;
            hint = `HINT: Make sure you are attaching a unique value to the key after "ListA-".`;
          }
        } else {
          actualMsg = `The cards do not have a key that starts with 'ListA-'.`;
          hint = `HINT: Check your spelling.`;
        }
      } else {
        actualMsg = "You must include a key prop in your card template.";
        hint = `HINT: make sure you are putting the key on the correct element.`;
      }

      if (
        cards.length > 1 &&
        firstCardId &&
        secondCardId &&
        firstCardId === secondCardId
      ) {
        actualMsg = "One or more keys are not unique.";
        hint = "HINT: The keys from each card must be unique.";
      }
    } else {
      actualMsg = "Friends Component does not have any cards displayed.";
      hint = "HINT: Make sure you are mapping your friends correctly.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  it("07 - There is no inline style in the cards that you are rendering.", async () => {
    let actualMsg,
      expectedMsg =
        "You have friends cards on the DOM and they don't have inline style.";
    let hint = "";

    await renderAct(() => {
      component = renderer.create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
    });
    let divs = component?.root?.findAllByType("div");
    const cards = divs?.filter(starterHelper.filterCards);
    const cardsWithStyle = cards?.filter(
      (card) => card._fiber?.memoizedProps?.style
    );

    const parentCardStyle = cards[0]?.parent?._fiber?.memoizedProps?.style;

    if (cards.length > 0) {
      if (cardsWithStyle.length > 0) {
        actualMsg = "You have inline style in the card template.";
      } else if (parentCardStyle) {
        actualMsg = "The parent of the card has inline style.";
        hint =
          "HINT: Make sure you are not adding inline style to the parent of the card.";
      } else {
        actualMsg = expectedMsg;
        hint =
          "HINT: Make sure you are not adding inline style to the card template.";
      }
    } else {
      actualMsg = "There are no friends cards on the DOM.";
      hint = "HINT: did you add some in the API Bootcamp?.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
