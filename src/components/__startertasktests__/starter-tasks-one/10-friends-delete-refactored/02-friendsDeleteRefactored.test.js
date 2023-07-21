import { create, act as renderAct } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import Friends from "../../../friends/Friends";
import Friend from "../../../friends/Friend";
import friendsService from "../../../../services/friendsService";
import usersService from "../../../../services/usersService";
import * as helper from "../../starterHelper";

import "../../sabioExpect";

jest.setTimeout(50000);
let number;

let userLoginData = helper.mockUser;
describe("Refactored deleteFriend service checks", () => {
  beforeAll(async () => {
    await renderAct(async () => {
      await usersService.login(userLoginData);
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  helper.serviceFileTests(
    "../../services/friendsService.js",
    "friendsService",
    ["deleteFriend"]
  );

  number = helper.numb;

  it(`${
    number < 10 ? `0${number}` : number
  } - The friendsService.js deleteFriend method should NOT invoke the .then function`, () => {
    let fxType = "unknown",
      functionBody,
      hasThen,
      expectedMsg,
      actualMsg,
      friendServiceFunction;

    expectedMsg =
      "The deleteFriend function SHOULD NOT invoke the .then function";
    actualMsg = expectedMsg;

    if (!friendsService?.deleteFriend) {
      friendServiceFunction = require("../../../../services/friendsService");
      fxType = typeof friendServiceFunction["deleteFriend"];
    } else if (friendsService.deleteFriend) {
      fxType = typeof friendsService.deleteFriend;
    } else if (friendsService.default && friendsService.default.deleteFriend) {
      fxType = typeof friendsService.default.deleteFriend;
    }

    if (fxType !== "unknown" && !friendServiceFunction) {
      functionBody =
        friendsService.deleteFriend?.toString() ??
        friendsService.default?.deleteFriend.toString();
      functionBody = functionBody.replace(/[^\S\r]+/g, "");

      hasThen =
        functionBody?.includes(".then(") && !functionBody?.includes("//.then(");
    } else if (fxType !== "unknown" && friendServiceFunction) {
      functionBody = friendServiceFunction["deleteFriend"]?.toString();
    }
    if (hasThen) {
      actualMsg =
        "The deleteFriend function was found to have invoked the .then function. Remove it.";
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });
});

number++;

describe("The refactoring of the delete functionality of a Friend card", () => {
  let friendComponent, showButton;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    await renderAct(async () => {
      await usersService.login(userLoginData);
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });

    await renderAct(() => {
      friendComponent = create(
        <MemoryRouter>
          <Friends />
        </MemoryRouter>
      );
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - Friends.jsx should be a functional component and render without errors.`, async () => {
    let actualMsg,
      expectedMsg =
        "The Friends component should render successfully on the DOM";
    actualMsg = expectedMsg;
    let isClassComp =
      friendComponent.root._fiber.elementType.toString().split(" ")[0] ===
      "class";

    if (isClassComp) {
      actualMsg =
        "The Friends component should be a functional component but it appears to be a class component";
    }

    if (!friendComponent) {
      actualMsg =
        "The Friends component failed to render successfully on the DOM";
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Friends.jsx should render Friend cards`, async () => {
    let friendCards;

    await renderAct(async () => {
      let buttons = await friendComponent.root.findAllByType("button");
      buttons.forEach((b) => {
        if (b.props.id === "show-friends") {
          showButton = b;
        }
      });
      showButton.props.onClick();
    });

    await renderAct(async () => {
      friendCards = await friendComponent.root.findAll(
        helper.elementByType(Friend)
      );
    });

    let actualMsg,
      expectedMsg = "Friend cards should be found on the DOM";
    actualMsg = expectedMsg;

    if (!friendCards || friendCards?.length === 0) {
      actualMsg = "No Friend cards were found on the DOM";
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The handleDeleteClicked function should invoke the getDeleteSuccessHandler`, async () => {
    const testInstance = friendComponent.root;
    let friendCards;
    await renderAct(async () => {
      friendCards = await testInstance.findAll(helper.elementByType(Friend));
    });

    const friendCard = friendCards[0];

    let actualMsg,
      hint,
      messageTracker = "",
      expectedMsg =
        "The handleDeleteClicked function should invoke the getDeleteSuccessHandler";
    actualMsg = expectedMsg;

    if (friendCard) {
      const handleDeleteClickedJSON =
        friendCard?.props.handleDeleteClicked.toString();

      if (!handleDeleteClickedJSON.includes("const handler")) {
        messageTracker +=
          "\nThe constant named 'handler' should be defined inside the handleDeleteClicked function";
      } else if (!handleDeleteClickedJSON.match("getDeleteSuccessHandler")) {
        messageTracker +=
          "\nThe value of the handler should be set to the result of invoking the 'getDeleteSuccessHandler' function inside the handleDeleteClicked function";
        hint =
          "HINT: The getDeleteSuccessHandler function should be defined outside the scope of the handleDeleteClicked function but invoked inside the handleDeleteClicked function";
      } else if (!handleDeleteClickedJSON.includes(".then(handler)")) {
        messageTracker = ""
          ? (messageTracker =
              "The constant 'handler' is not being passed to the .then() inside handleDeleteClicked.")
          : messageTracker +
            "\nThe constant 'handler' is not being passed to the .then() inside handleDeleteClicked.";
        hint =
          "HINT: The '.then' function should be passed the constant 'handler'.";
      }

      if (messageTracker) {
        actualMsg = messageTracker;
      }
    } else {
      actualMsg = "Was not able to find a Friend card to test";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
