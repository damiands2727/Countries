import React from "react";
import { create, act as renderAct } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/react";
import Friends from "../../../friends/Friends";
import Friend from "../../../friends/Friend";
import usersService from "../../../../services/usersService";
import friendsService from "../../../../services/friendsService";
import * as helper from "../../starterHelper";
import axios from "axios";
import "../../sabioExpect";
import { render } from "enzyme";
jest.setTimeout(20000);

let number;
const generalErrors = {
  login:
    "Unable to login. Please check your usersService.js file and previous tests.",
  render:
    "An error ocurred while rendering your Friends.jsx component. Double check your code " +
    "and service files. Make sure it renders correctly.",
  showFriends:
    "No button for showing friends was found. Make sure you added a button id " +
    '"show-friends" to your Friends.jsx component',
};

describe("friendsService checks", () => {
  let loginSuccess, component;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    try {
      await renderAct(async () => {
        await usersService.login(helper.mockUser);
      });
      loginSuccess = true;
    } catch {
      loginSuccess = false;
    }
  });

  helper.serviceFileTests("../../services/friendsService", "friendsService", [
    "getFriends",
    "deleteFriend",
  ]);

  afterEach(() => {
    jest.restoreAllMocks();
    component?.unmount();
 });

  number = helper.numb;

  it(`${
    number < 10 ? `0${number}` : number
  } - The deleteFriend method SHOULD invoke the .then function inside the service file.`, () => {
    let fxType = "unknown",
      functionBody,
      hasThen,
      notThen,
      expectedMsg,
      actualMsg,
      friendServiceFunction;

    let hint = "";

    if (loginSuccess) {
      expectedMsg =
        "The deleteFriend function SHOULD invoke the .then function";
      actualMsg = expectedMsg;

      if (!friendsService?.deleteFriend) {
        friendServiceFunction = require("../../../../services/friendsService");
        fxType = typeof friendServiceFunction["deleteFriend"];
      } else if (friendsService.deleteFriend) {
        fxType = typeof friendsService.deleteFriend;
      } else if (
        friendsService.default &&
        friendsService.default.deleteFriend
      ) {
        fxType = typeof friendsService.default.deleteFriend;
      }

      if (fxType !== "unknown" && !friendServiceFunction) {
        functionBody =
          friendsService.deleteFriend?.toString() ??
          friendsService.default?.deleteFriend.toString();
        functionBody = functionBody.replace(/[^\S\r]+/g, "");

        hasThen = functionBody?.includes(".then(");
        notThen = functionBody?.includes("//.then(");
      }
      if (!hasThen || notThen) {
        actualMsg =
          "The deleteFriend function was found to NOT have invoked the .then function.";
        hint = `HINT: Make sure your .then function is there and is not commented out.`;
      }
    } else {
      actualMsg = generalErrors.login;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - friendService deleteFriend was called with the correct parameters.`, async () => {
    let actualMsg, hint, axiosResInterceptor;
    let expectedMsg =
      "friendService deleteFriend was called with the correct parameters.";
    actualMsg = expectedMsg;
    let isAxiosSuccessful = false;
    let idValue = -5;
    let component;
    let loginError;
    let axiosSpy = jest.spyOn(friendsService, "deleteFriend");

    try {
      axiosResInterceptor = axios.interceptors.request.use((config) => {
        let method = config?.method;
        let urlParam = config?.url?.split("/")[5];

        if (!!!urlParam) {
          actualMsg = "No 'id' parameter was found in your deleteFriend URL.";
          hint = `HINT: Make sure you are passing in the Id parameter into your deleteFriend URL in your service file.`;
        }

        if (!method === "delete") {
          actualMsg = "deleteFriend was not called with the correct method.";
          hint = `HINT: Make sure you are using the correct method ('DELETE') in your deleteFriend function.`;
        }

        if (!isNaN(urlParam)) {
          if (parseInt(urlParam) === idValue) {
            isAxiosSuccessful = true;
          } else {
            actualMsg =
              "The Id in the deleteFriend URL has a hard coded value.";
          }
        } else {
          actualMsg = "The Id in the deleteFriend URL is not a number.";
          hint = `HINT: Make sure you are passing an integer value for the 'id' parameter in your deleteFriend URL.`;
        }
        if (config.url.includes("friends") && config.url.includes("id")) {
          isAxiosSuccessful = true;
        }
        return config;
      });

      await renderAct(async () => {
        await friendsService.deleteFriend(idValue);
      });

      await renderAct(async () => {
        component = render.create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
      });

      if (!!loginError) {
        actualMsg = loginError;
      } else {
        let usingUseCallBack = false;
        let friendInstance = component?.root?.find(
          helper.elementByType(Friends)
        );
        if (!!friendInstance) {
          if (!!friendInstance?._fiber?._debugHookTypes) {
            usingUseCallBack =
              friendInstance?._fiber?._debugHookTypes?.includes("useCallback");
          }
        }

        if (axiosSpy.mock.calls.length === 0 || !usingUseCallBack) {
          actualMsg =
            "deleteFriend was not called or was not called using useCallback.";
          hint = `HINT: Make sure you are calling deleteFriend using useCallback in your Friends.jsx component.`;
        } else if (!isAxiosSuccessful) {
          actualMsg =
            "deleteFriend was not called with the incorrect parameters.";
          hint = `HINT: Make sure you are passing the correct parameters into your deleteFriend URL in your service file.`;
        }
      }
    } catch (error) {
      if (actualMsg === expectedMsg && error.response?.status === 404) {
        actualMsg = "Something went wrong with your deleteFriend function.";
        hint = `HINT: Double check your code`;
      }
    } finally {
      axios.interceptors.request.eject(axiosResInterceptor);
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The getFriends method SHOULD invoke the .then function inside the service file.`, () => {
    let fxType = "unknown",
      functionBody,
      hasThen,
      notThen,
      expectedMsg,
      actualMsg,
      friendServiceFunction;

    let hint = "";

    if (loginSuccess) {
      expectedMsg = "The getFriends function SHOULD invoke the .then function";
      actualMsg = expectedMsg;

      if (!friendsService?.getFriends) {
        friendServiceFunction = require("../../../../services/friendsService");
        fxType = typeof friendServiceFunction["getFriends"];
      } else if (friendsService.getFriends) {
        fxType = typeof friendsService.getFriends;
      } else if (friendsService.default && friendsService.default.getFriends) {
        fxType = typeof friendsService.default.getFriends;
      }

      if (fxType !== "unknown" && !friendServiceFunction) {
        functionBody =
          friendsService.getFriends?.toString() ??
          friendsService.default?.getFriends.toString();
        functionBody = functionBody.replace(/[^\S\r]+/g, "");

        hasThen = functionBody?.includes(".then(");
        notThen = functionBody?.includes("//.then(");
      }
      if (!hasThen || notThen) {
        actualMsg =
          "The getFriends function was found to NOT have invoked the .then function.";
        hint = `HINT: Make sure your .then function is there and is not commented out.`;
      }
    } else {
      actualMsg = generalErrors.login;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});

number++;

describe("Friend component: Functional Component Check", () => {
  let friendComponent, loginSuccess;
  let expectedMsg, actualMsg
    expectedMsg = "You are logged-in.";
    actualMsg = expectedMsg;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    try {
      await renderAct(async () => {
        await usersService.login(helper.mockUser);
      });
      loginSuccess = true;
    } catch {
      loginSuccess = false;
      
    }
    
    if(!loginSuccess){
      actualMsg = generalErrors.login;
    }
    await renderAct(() => {
      friendComponent = create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
    });
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - Friends.jsx is a FUNCTIONAL component.`, async () => {
    let expectedMsg, actualMsg, hint;
    expectedMsg = "Friend.jsx is a functional component.";
    actualMsg = expectedMsg;

    try {
      await renderAct(() => {
        friendComponent = create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
      });
      try {
        let isClassComp =
          friendComponent.root._fiber.memoizedProps.children.type
            .toString()
            .split(" ")[0] === "class";

        if (isClassComp) {
          actualMsg = "Friends.jsx is not a functional component.";
          hint = "HINT: Make sure your Friends.jsx is not a class component.";
        }
      } catch (error) {
        actualMsg = "Your Friends component won't render.";
        hint = "HINT: Remember we won't be using class components anymore.";
      }
    } catch (error) {
      actualMsg = "Your Friends component won't render.";
      hint = "HINT: Remember we won't be using class components anymore.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});

number++;

describe("Friends.jsx component: Import the Friend.jsx component and add the following props: friend, key & onFriendClicked", () => {
  let comp, loginSuccess, localRenderSuccess,  renderCardsSuccess;
  let expectedMsg, actualMsg
  expectedMsg = "You are logged-in.";
  actualMsg = expectedMsg;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    try {
      await renderAct(async () => {
        await usersService.login(helper.mockUser);
      });

      loginSuccess = true;

      await renderAct(() => {
        let friends = helper.testAddFriends();
        friends.forEach((friend) => {
          helper.addFriend(friend);
        });
      });
    } catch {
      loginSuccess = false;
    }

    if(!loginSuccess){
      actualMsg = generalErrors.login;
    }

    try {
      await renderAct(async () => {
        comp = create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
        localRenderSuccess = true;
        return new Promise((resolve) => setTimeout(resolve, 3000));
      });

      try {
        let showButton = comp.root.findByProps({ id: "show-friends" });

        await renderAct(async () => {
          showButton.props.onClick({ preventDefault: () => {} });
          return new Promise((resolve) => setTimeout(resolve, 2000));
        });
        renderCardsSuccess = true;
      } catch {
        renderCardsSuccess = false;
      }
    } catch {
      localRenderSuccess = false;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - The Friend component should should contain the 'friend', 'key' and 'onFriendClicked' properties`, async () => {
    let actualMsg, expectedMsg;
    let hint = "";

    if (localRenderSuccess && renderCardsSuccess) {
      expectedMsg =
        "The Friend component should contain the 'friend', 'key' and 'onFriendClicked' properties";
      actualMsg = expectedMsg;

      let friendComponent = comp?.root?.findAll(
        helper.elementByType(Friend)
      )[0];

      if (!friendComponent.props.onFriendClicked) {
        actualMsg =
          "The Friend component does not contain the 'onFriendClicked' property";
        hint =
          "HINT: Make sure you are passing the 'onFriendClicked' property to the Friend component";
      } else if (!friendComponent._fiber.key) {
        actualMsg = "The Friend component does not contain the 'key' property";
        hint =
          "HINT: Make sure you are passing the 'key' property to the Friend component";
      } else if (!friendComponent.props.friend) {
        actualMsg =
          "The Friend component does not contain the 'friend' property";
        hint =
          "HINT: Make sure you are passing the 'friend' property to the Friend component";
      }
    } else {
      actualMsg = !localRenderSuccess
        ? "An error ocurred while rendering your Friend.jsx component. Double check your code " +
          "and service files. Make sure it renders correctly."
        : "Something is wrong with your Show Button. Make sure it is rendering correctly or that your Friend.jsx component contains the 'friend' property ";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});

number++;
describe("Friend component: Handling the delete functionality of a Friend card", () => {
  let component, loginSuccess, renderSuccess, divs, cards;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    try {
      await renderAct(async () => {
        await usersService.login(helper.mockUser);
      });

      loginSuccess = true;

      await renderAct(() => {
        let friends = helper.testAddFriends();
        friends.forEach((friend) => {
          helper.addFriend(friend);
        });
      });
    } catch {
      loginSuccess = false;
    }

    try {
      await renderAct(async () => {
        component = create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
        renderSuccess = true;
        return new Promise((resolve) => setTimeout(resolve, 3000));
      });
    } catch {
      renderSuccess = false;
    }
    divs = await component.root.findAllByType("div");
    cards = divs?.filter((div) => div.props?.className?.includes("cards"));

    if (cards?.length === 0) {
      try {
        let showButton = component.root.findByProps({ id: "show-friends" });

        await renderAct(async () => {
          showButton.props.onClick({ preventDefault: () => {} });
          return new Promise((resolve) => setTimeout(resolve, 200));
        });
      } catch {
        renderSuccess = false;
      }
    }
  });

  afterAll(() => {
    component?.unmount();
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - Friends.jsx should be rendering Friend cards`, async () => {
    let friendCards, actualMsg;
    const expectedMsg = "Friend cards should be found on the DOM";

    if (loginSuccess) {
      friendCards = component?.root?.findAll(helper.elementByType(Friend));
      actualMsg = expectedMsg;

      if (!friendCards || friendCards.length === 0) {
        actualMsg = "No Friend cards were found on the DOM";
      }
    } else {
      actualMsg = generalErrors.login;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Each 'Friend.jsx' component has a key property with the id property from the friend object`, async () => {
    let friendCards, testInstance, hint, actualMsg;
    const expectedMsg =
      "Each Friend card should have a unique key property whose value is the 'ListA-'+ the id from the friend object";

    if (loginSuccess) {
      testInstance = component.root;
      friendCards = testInstance.findAll(helper.elementByType(Friend));

      const keys = [];
      actualMsg = expectedMsg;

      if (!friendCards) {
        actualMsg = "No Friend cards were found on the DOM";
      }

      if (actualMsg !== "No Friend cards were found on the DOM") {
        for (let index = 0; index < friendCards.length; index++) {
          const friendKey = friendCards[index]?._fiber?.key;

          if (!friendKey) {
            actualMsg = "A key was not found on the Friend card";
            break;
          }
          if (friendKey === "ListA-") {
            actualMsg =
              "A Friend card has a key that is missing the friend's id";
            hint =
              "HINT: Make sure you are concatenating the friend's id to the string 'ListA-'";
            break;
          }
          keys.push(friendKey);
        }
      }
      let keyDups = keys.some((element, index) => {
        return keys.indexOf(element) !== index;
      });

      if (
        actualMsg !== "No Friend cards were found on the DOM" &&
        actualMsg !== "A key was not found on the Friend card" &&
        actualMsg !==
          "A Friend card has a key that is missing the friend's id" &&
        keyDups
      ) {
        actualMsg =
          "A Friend card has a duplicate key. In other words, there are Friend cards that have the same key property value";
      }
    } else {
      actualMsg = generalErrors.login;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - All Friend cards should have a delete button`, async () => {
    let foundButtons, testInstance, friendCards, actualMsg;
    const expectedMsg = "Each Friend card contains a delete button";

    if (renderSuccess) {
      testInstance = component.root;
      friendCards = testInstance.findAll(helper.elementByType(Friend));
      foundButtons = testInstance.findAllByType("button");

      let countOfButtons = 0;
      const countOfFriendCards = friendCards?.length;

      foundButtons.forEach((button) => {
        if (button.children) {
          for (let child of button.children) {
            if (
              typeof child === "string" &&
              (child.includes("Delete") || child.includes("delete"))
            ) {
              countOfButtons++;
            }
          }
        }
      });
      actualMsg = expectedMsg;

      if (!foundButtons || countOfButtons === 0) {
        actualMsg = "No delete buttons were found on the Friend cards";
      }

      if (
        actualMsg !== "No delete buttons were found on the Friend cards" &&
        countOfButtons !== countOfFriendCards
      ) {
        actualMsg =
          "The amount of delete buttons found do not match up with the amount of Friend cards found";
      }
    } else {
      actualMsg = renderSuccess
        ? generalErrors.showFriends
        : generalErrors.render;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The onDeleteRequested function from the Friends component should be passed to each Friend card`, async () => {
    let friendCards, testInstance, actualMsg;
    const expectedMsg =
      "Each Friend card should be passed the onDeleteRequested function through props";

    if (renderSuccess) {
      testInstance = component.root;
      friendCards = await testInstance.findAll(helper.elementByType(Friend));

      actualMsg = expectedMsg;

      if (!friendCards || friendCards?.length === 0) {
        actualMsg = "No Friend cards were found on the DOM";
      }

      if (actualMsg !== "No Friend cards were found on the DOM") {
        friendCards.forEach((friendCard) => {
          if (
            !friendCard.props?.onFriendClicked ||
            typeof friendCard.props?.onFriendClicked !== "function"
          ) {
            actualMsg =
              "The onDeleteRequested function was not found to be passed to a Friend card";
          }
        });
      }
    } else {
      actualMsg = renderSuccess
        ? generalErrors.showFriends
        : generalErrors.render;
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The correct object data should be passed to each friend card through a PROP called friend`, async () => {
    let friendCards, testInstance, actualMsg;
    const expectedMsg =
      "Each Friend card should be passed friend data through a PROP called friend";

    if (renderSuccess) {
      testInstance = component.root;
      friendCards = await testInstance.findAll(helper.elementByType(Friend));

      actualMsg = expectedMsg;

      if (!friendCards || friendCards?.length === 0) {
        actualMsg = "No Friend cards were found on the DOM";
      }

      if (actualMsg !== "No Friend cards were found on the DOM") {
        friendCards.forEach((friendCard) => {
          if (
            !friendCard.props?.friend ||
            typeof friendCard.props?.friend !== "object"
          ) {
            actualMsg =
              "The property friend was not found or the friend data was not passed to the Friend card";
          }
        });
      }
    } else {
      actualMsg = renderSuccess
        ? generalErrors.showFriends
        : generalErrors.render;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The delete button on each Friend card should have an onClick handler`, async () => {
    let foundButtons, testInstance, deleteButtons, actualMsg;
    const expectedMsg =
      "Each Friend card should be passed the onDeleteRequested function through props";

    if (renderSuccess) {
      testInstance = component.root;
      foundButtons = await testInstance.findAllByType("button");

      deleteButtons = await foundButtons?.filter((button) => {
        return button.props.children.match(/\bdelete\b/i);
      });
      actualMsg = expectedMsg;

      if (!deleteButtons || deleteButtons?.length === 0) {
        actualMsg = "No delete buttons were found on the Friend cards";
      }

      if (actualMsg !== "No delete buttons were found on the Friend cards") {
        deleteButtons.forEach((button) => {
          if (!button.props?.onClick) {
            actualMsg = "An onClick handler was not found on the delete button";
          }
        });
      }
    } else {
      actualMsg = renderSuccess
        ? generalErrors.showFriends
        : generalErrors.render;
    }
    expect(expectedMsg).sabioToBe(actualMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The delete button's click handler should invoke the onDeleteRequested function from props`, async () => {
    let deleteClickHandler, comp, actualMsg, localRenderSuccess, hint;
    const expectedMsg = `The Friend card's delete function should invoke the handleDeleteClicked function from props`;
    const aFriend = { ...helper.mockFriend, id: 12 };
    const onDeleteRequested = jest.fn();

    actualMsg = expectedMsg;

    try {
      await renderAct(async () => {
        comp = create(
          <MemoryRouter>
            <Friend friend={aFriend} onFriendClicked={onDeleteRequested} />
          </MemoryRouter>
        );
      });
      localRenderSuccess = true;
    } catch {
      localRenderSuccess = false;
      actualMsg =
        "An error ocurred while rendering your Friend.jsx component. Double check your code " +
        "and service files. Make sure it renders correctly.";
    }

    if (localRenderSuccess) {
      try {
        const buttons = comp.root.findAllByType("button");
        for (let button of buttons) {
          if (button.props.children.match(/\bdelete\b/i)) {
            deleteClickHandler = button;
          }
        }
        await renderAct(async () => {
          if (deleteClickHandler.props.onClick) {
            deleteClickHandler.props.onClick({ preventDefault: () => {} });
          }
        });

        if (onDeleteRequested.mock.calls.length === 0) {
          actualMsg = `The onDeleteRequested function was not invoked from the Friend card's delete button`;
        }
      } catch {
        actualMsg =
          "There was an error while testing the delete button on your Friend.jsx component.";
        hint =
          "HINT: Make sure you are adding a delete button on every friend card with the text 'Delete' " +
          "and it has an onClick handler.";
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
    jest.resetAllMocks();
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - When the onDeleteRequested function is invoked by a Friend card's delete button the correct friend is expected to be deleted dynamically from the DOM`, async () => {
    let friendCards, testInstance, actualMsg, expectedMsg, hint;

    if (renderSuccess) {
      testInstance = component.root;

      try {
        friendCards = await testInstance.findAll(helper.elementByType(Friend));
        const randomIndex = Math.floor(
          Math.random() * (friendCards.length > 0 ? friendCards.length - 1 : 0)
        );
        const friend = friendCards[randomIndex];
        const friendData = { ...friend.props?.friend };
        const idToLookFor = friendData.id;
        expectedMsg = `Friend card with the id ${idToLookFor} should NOT be found in the DOM`;
        actualMsg = expectedMsg;

        await renderAct(() => {
          friend.props.onFriendClicked(friendData);
          return new Promise((resolve) => setTimeout(resolve, 4000));
        });

        let doesFriendCardExist;

        const friendCardsAfter = testInstance.findAll(
          helper.elementByType(Friend)
        );

        doesFriendCardExist = friendCardsAfter?.some(
          (friendCard) => friendCard.props.friend.id === idToLookFor
        );

        if (doesFriendCardExist) {
          actualMsg = "The Friend card was still found on the DOM";
        }
      } catch {
        actualMsg =
          "There was an error while testing your onDeleteRequested handler.";
        hint =
          'HINT: Make sure you are passing a function as a property named "onDeleteRequested" ' +
          "to your Friend.jsx components and it is being invoked when clicking the delete button.";
      }
    } else {
      actualMsg = renderSuccess
        ? generalErrors.showFriends
        : generalErrors.render;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
