import React from "react";
import { create, act as renderAct } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/react";
import Friends from "../../../friends/Friends";
import Friend from "../../../friends/Friend";
import usersService from "../../../../services/usersService";
import friendsService from "../../../../services/friendsService";
import * as helper from "../../starterHelper";
import "../../sabioExpect";
jest.setTimeout(20000);

let number;
const generalErrors = {
  login: "Unable to login. Please check your usersService.js file and previous tests.",
  render: "An error ocurred while rendering your Friends.jsx component. Double check your code " +
    "and service files. Make sure it renders correctly.",
  showFriends: "No button for showing friends was found. Make sure you added a button id " +
    '"show-friends" to your Friends.jsx component',
};

describe("friendsService checks", () => {
  let loginSuccess;

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

  number = helper.numb;

  it(`${
    number < 10 ? `0${number}` : number
  } - The deleteFriend method SHOULD invoke the .then function inside the service file.`, () => {
    let fxType = "unknown",
      functionBody,
      hasThen,
      expectedMsg,
      actualMsg,
      friendServiceFunction;

    if(loginSuccess) {
      expectedMsg = "The deleteFriend function SHOULD invoke the .then function";
      actualMsg = expectedMsg;
      if(!friendsService?.deleteFriend){
        friendServiceFunction = require("../../../../services/friendsService");
        fxType = typeof friendServiceFunction["deleteFriend"];
      }
      else if (friendsService.deleteFriend) {
        fxType = typeof friendsService.deleteFriend;
      } else if (friendsService.default && friendsService.default.deleteFriend) {
        fxType = typeof friendsService.default.deleteFriend;
      }
  
      if (fxType !== "unknown" && !friendServiceFunction) {
        functionBody =
          friendsService.deleteFriend?.toString() ??
          friendsService.default?.deleteFriend.toString();
  
          hasThen = functionBody?.includes(".then(") &&
          !functionBody?.includes("//.then(");
      } else if (fxType !== "unknown" && friendServiceFunction) {
        functionBody =
          friendServiceFunction["deleteFriend"]?.toString();
        
          hasThen = functionBody?.includes(".then(") &&
          !functionBody?.includes("//.then(");
        }
      if (!hasThen) {
        actualMsg =
          "The deleteFriend function was found to NOT have invoked the .then function. Add it.";
      }
    } else {
      actualMsg = generalErrors.login;
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });
});

number++;

describe("Friend component: Handling the delete functionality of a Friend card", () => {
  let component, loginSuccess, renderSuccess, showFriendsSuccess;
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
      loginSuccess = false
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

    try {
      let showButton = component.root.findByProps({id: "show-friends"});
  
      await renderAct(async () => {
        showButton.props.onClick();
        return new Promise((resolve) => setTimeout(resolve, 200));
      });
      showFriendsSuccess = true;
    } catch {
      showFriendsSuccess = false;
    }

  });

  afterAll(() => {
    component?.unmount();
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - The Friends.jsx component is a functional component that renders without errors.`, async () => {
    let localComponent, actualMsg;
    const expectedMsg = "The Friends component should render successfully on the DOM";

    try {
      // creating a local version of the Friends.jsx component because we don't want it wrapped in memory router
      // otherwise we will get a type of MemoryRouter instead of function or object
      await renderAct(async () => {
        localComponent = create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
      });
      let isClassComp =
        localComponent.root._fiber.elementType.toString().split(" ")[0] ===
        "class";
      actualMsg = expectedMsg;
  
      if (!localComponent) {
        actualMsg =
          "The Friends component failed to render successfully on the DOM";
      }
      if (isClassComp) {
        actualMsg += "\nThe Friends component is not a functional component";
      }
    } catch {
      actualMsg = generalErrors.render;
      renderSuccess = false;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
    localComponent.unmount();
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Friends.jsx should be rendering Friend cards`, async () => {
    let friendCards, actualMsg;
    const expectedMsg = "Friend cards should be found on the DOM";

    if(loginSuccess) {
      friendCards = component.root.findAll(helper.elementByType(Friend));      
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
    const expectedMsg ="Each Friend card should have a unique key property whose value is the 'ListA-'+ the id from the friend object";

    if(loginSuccess) {
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
          if(friendKey === "ListA-"){
            actualMsg = "A Friend card has a key that is missing the friend's id";
            hint= "HINT: Make sure you are concatenating the friend's id to the string 'ListA-'";
            break;
          }
          keys.push(friendKey);
        }
      }
      let keyDups = keys.some((element, index) => {
        return keys.indexOf(element) !== index
      });
  
      if(actualMsg !== "No Friend cards were found on the DOM"
          && actualMsg !== "A key was not found on the Friend card" 
          && actualMsg !== "A Friend card has a key that is missing the friend's id" 
          && keyDups
        ){
          actualMsg = "A Friend card has a duplicate key. In other words, there are Friend cards that have the same key property value";
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

    if(renderSuccess && showFriendsSuccess) {
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
      actualMsg = renderSuccess ? generalErrors.showFriends : generalErrors.render;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The handleDeleteClicked function from the Friend component should be passed to each Friend card`, async () => {
    let friendCards, testInstance, actualMsg;
    const expectedMsg = "Each Friend card should be passed the handleDeleteClicked function through props";

    if(renderSuccess && showFriendsSuccess) {
      testInstance = component.root;
      friendCards = await testInstance.findAll(helper.elementByType(Friend));
        
      actualMsg = expectedMsg;
  
      if (!friendCards || friendCards?.length === 0) {
        actualMsg = "No Friend cards were found on the DOM";
      }
  
      if (actualMsg !== "No Friend cards were found on the DOM") {
        friendCards.forEach((friendCard) => {
          if (
            !friendCard.props?.handleDeleteClicked ||
            typeof friendCard.props?.handleDeleteClicked !== "function"
          ) {
            actualMsg =
              "The handleDeleteClicked function was not found to be passed to a Friend card";
          }
        });
      }
    } else {
      actualMsg = renderSuccess ? generalErrors.showFriends : generalErrors.render;
    }

    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The friend object should be passed to each friend card through a prop called friend`, async () => {
    let friendCards, testInstance, actualMsg;
    const expectedMsg = "Each Friend card should be passed friend data through a prop called friend";

    if(renderSuccess && showFriendsSuccess) {
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
      actualMsg = renderSuccess ? generalErrors.showFriends : generalErrors.render;
    }
    expect(actualMsg).sabioToBe(expectedMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The delete button on each Friend card should have an onClick handler`, async () => {
    let foundButtons, testInstance, deleteButtons, actualMsg;
    const expectedMsg = "Each Friend card should be passed the handleDeleteClicked function through props";

    if(renderSuccess && showFriendsSuccess) {
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
      actualMsg = renderSuccess ? generalErrors.showFriends : generalErrors.render;
    }
    expect(expectedMsg).sabioToBe(actualMsg);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The delete button's click handler should invoke the handleDeleteClicked function from props`, async () => {
    let deleteClickHandler, comp, actualMsg, localRenderSuccess, hint;
    const expectedMsg = `The Friend card's delete function should invoke the handleDeleteClicked function from props`;
    const aFriend = { ...helper.mockFriend, id: 12 }
    const handleDeleteClicked = jest.fn();
    
    actualMsg = expectedMsg;

    try {
      await renderAct(async () => {
        comp = create(
          <MemoryRouter>
            <Friend friend={aFriend} handleDeleteClicked={handleDeleteClicked} />
          </MemoryRouter>
        );
      });
      localRenderSuccess = true;
    } catch {
      localRenderSuccess = false;
      actualMsg = "An error ocurred while rendering your Friend.jsx component. Double check your code " +
        "and service files. Make sure it renders correctly."
    }

    if(localRenderSuccess) {
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
    
        if (handleDeleteClicked.mock.calls.length === 0) {
          actualMsg = `The handleDeleteClicked function was not invoked from the Friend card's delete button`;
        }
      } catch {
        actualMsg = "There was an error while testing the delete button on your Friend.jsx component."
        hint = "HINT: Make sure you are adding a delete button on every friend card with the text 'Delete' " +
          "and it has an onClick handler.";
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
    jest.resetAllMocks();
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - When the handleDeleteClicked function is invoked by a Friend card's delete button the correct friend is expected to be deleted dynamically from the DOM`, async () => {
    let friendCards, testInstance, actualMsg, expectedMsg, hint;
    
    if(renderSuccess && showFriendsSuccess) {
      testInstance = component.root;
      
      try {
      friendCards = await testInstance.findAll(helper.elementByType(Friend));
      const randomIndex = Math.floor(Math.random() * (friendCards.length > 0 ? friendCards.length - 1 : 0));
      const friend = friendCards[randomIndex];
      const friendData = { ...friend.props?.friend };
      const idToLookFor = friendData.id;
      expectedMsg = `Friend card with the id ${idToLookFor} should NOT be found in the DOM`;
      actualMsg = expectedMsg;
      
        await renderAct(() => {
          friend.props.handleDeleteClicked(friendData.id);
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
        actualMsg = "There was an error while testing your handleDeleteClicked handler."
        hint = 'HINT: Make sure you are passing a function as a property named "handleDeleteClicked" ' +
          'to your Friend.jsx components and it is being invoked when clicking the delete button.'
      }
    } else {
      actualMsg = renderSuccess ? generalErrors.showFriends : generalErrors.render;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
