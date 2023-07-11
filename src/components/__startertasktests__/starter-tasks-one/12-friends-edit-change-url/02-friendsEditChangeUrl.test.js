import React from "react";
import { MemoryRouter } from "react-router-dom";
import { act, create } from "react-test-renderer";
import App from "../../../../App";
import Friends from "../../../friends/Friends";
import Friend from "../../../friends/Friend";
import FriendForm from "../../../friends/FriendForm";
import "../../sabioExpect";
import * as starterHelper from "../../starterHelper";
import axios from "axios";

let friendsService = require("../../../../services/friendsService");

if (friendsService.default) {
  friendsService = friendsService.default;
} else if (friendsService.friendsService) {
  friendsService = friendsService.friendsService;
}

let usersService = require("../../../../services/usersService");

if (usersService.default) {
  usersService = usersService.default;
} else if (usersService.usersService) {
  usersService = usersService.usersService;
}

const https = require("https");

jest.setTimeout(30000);

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.httpAgent = new https.Agent({ keepAlive: true });
  return config;
});

describe("friendsService.js checks", () => {
  starterHelper.serviceFileTests(
    "../../services/friendsService",
    "friendsService",
    ["getById", "getFriends", "addFriend"]
  );
});

let num = starterHelper?.numb;

describe("Friend Edit Test", () => {
  let loginWorks = true;
  let addFriendWorks = true;
  let isAxiosSuccess = false;
  let hint = "";
  let testComponent,
    editButton,
    getByIdCalledTimes,
    friendToEdit,
    axiosResInterceptor;

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => {
      try {
        await usersService.login({
          email: "randomUser@user.com",
          password: "12ThisPassword!",
          tenantId: "TestUser",
        });
      } catch {
        loginWorks = false;
      }
      try {
        await friendsService.addFriend({
          title: "Some Title",
          bio: "some Bio",
          summary: "some Summary",
          headline: "a Headline",
          slug: `friendSlug ${Date.now()}`,
          statusId: "Active",
          primaryImage: "www.someimage.com",
        });
      } catch {
        addFriendWorks = false;
      }
    });
  });

  it(`${
    num < 10 ? `0${num}` : num
  } - The Friend Form component should have a route in the App.jsx to Edit Friends`, async () => {
    let friendsFormInstance, pathId;
    try {
      await act(() => {
        testComponent = create(
          <MemoryRouter initialEntries={["/friends/46546"]}>
            <App />
          </MemoryRouter>
        );
      });
    } catch (error) {
      hint = error;
    }

    let actualMsg,
      expectedMsg = `The FriendsForm.jsx has a route with path '/friends/:id' in App.jsx`;
    actualMsg = expectedMsg;

    if (hint) {
      actualMsg = "The FriendsForm.jsx is not rendering";
    } else {
      try {
        friendsFormInstance = testComponent.root.find(
          starterHelper.elementByType(FriendForm)
        );

        pathId = friendsFormInstance?.parent?.props?.match?.params?.id;
      } catch {
        hint =
          "HINT: Make sure you have a route with path '/friends/:id' for the FriendsForm component in your App.jsx file.";
      }

      if (pathId !== "46546") {
        hint =
          "HINT: Make sure you have a route with path '/friends/:id' for the FriendsForm component in your App.jsx file.";
      }

      if (!friendsFormInstance || hint) {
        actualMsg = `The FriendsForm Component does not have a route with path '/friends/:id' in App.jsx`;
      }
    }

    testComponent?.unmount();
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  num++;
  it(`${
    num < 10 ? `0${num}` : num
  } - The Friend.jsx card components should have a button with the text of 'Edit'`, async () => {
    hint = "";
    let actualMsg,
      expectedMsg = `The Friend.jsx card components has an Edit Button`;
    actualMsg = expectedMsg;

    let isAxiosSuccess = false;
    let showFriendsBtn;

    const isAxiosCallCorrect = (res) => {
      return (
        res?.config?.url.includes(`pageIndex`) &&
        res?.config?.url.includes(`pageSize`) &&
        !res?.config?.url.includes("search")
      );
    };

    axiosResInterceptor = axios.interceptors.response.use((response) => {
      if (isAxiosCallCorrect(response)) {
        isAxiosSuccess = true;
      }
      return response;
    }, null);

    try {
      await act(() => {
        testComponent = create(
          <MemoryRouter initialEntries={["/friends"]}>
            <App />
          </MemoryRouter>
        );
        return new Promise((resolve) => setTimeout(resolve, 2000));
      });

      axios.interceptors.response.eject(axiosResInterceptor);

      if (!isAxiosSuccess) {
        throw new Error(
          `HINT: Make sure your getFriends method is working correctly.`
        );
      }

      try {
        showFriendsBtn = testComponent.root?.findByProps({
          id: "show-friends",
        });
      } catch {
        throw new Error(
          "HINT: Make sure you have a button with the id of 'show-friends' that will show or hide the Friend card components."
        );
      }

      await act(async () => {
        await showFriendsBtn?.props?.onClick();
        return new Promise((resolve) => setTimeout(resolve, 100));
      });

      let friendCardInstances = testComponent.root.findAll(
        starterHelper.elementByType(Friend)
      );

      if (friendCardInstances?.length === 0) {
        throw new Error("HINT: No Friend.jsx card components found");
      }

      let cardButtons = friendCardInstances[0].findAllByType("button");

      let editButtons = cardButtons?.filter((button) =>
        starterHelper?.isStrInElementCI(button, "Edit")
      );

      if (editButtons.length !== 1) {
        throw new Error(
          "HINT: There should be one button with the text of 'Edit' per Friend.jsx card component"
        );
      } else {
        editButton = editButtons[0];
      }
    } catch (error) {
      hint = `${error}`;
    }
    if (hint) {
      actualMsg = "Something went wrong with the Friends.jsx component.\n ";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  num++;

  it(`${
    num < 10 ? `0${num}` : num
  } - On Click of the Edit Button, the Friend Form component should render and the URL must have the id of the Friend Clicked`, async () => {
    hint = "";
    let actualMsg,
      expectedMsg = `On Click of the Edit Button, the Friend Form component should render and the URL must have the id of the Friend Clicked`;
    actualMsg = expectedMsg;
    let friendsInstance;

    if (loginWorks && addFriendWorks) {
      try {
        friendsInstance = testComponent.root.find(
          starterHelper.elementByType(Friends)
        );
      } catch {
        actualMsg = "The Friends.jsx is not rendering";
      }

      let arrayOfFriendsState = starterHelper.getStatePropVal(
        friendsInstance?._fiber?.memoizedState,
        "arrayOfFriends"
      );

      let idOfFriendToEdit = arrayOfFriendsState[0]?.id;

      let axiosGetByIdSpy = jest.spyOn(friendsService, "getById");

      const isAxiosCallCorrect = (res) =>
        res?.config?.url.includes(`api/friends/${idOfFriendToEdit}`) &&
        res?.config?.method === "get";

      axiosResInterceptor = axios.interceptors.response.use((res) => {
        console.log(res);
        if (isAxiosCallCorrect(res)) {
          isAxiosSuccess = true;
          friendToEdit = res?.data?.item;
        }
        return res;
      });

      await act(async () => {
        if (editButton) {
          await editButton.props.onClick();
          return new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw new Error(
            "HINT: Make sure you have a button with the text of 'Edit' per Friend.jsx card component"
          );
        }
      });

      let friendFormInstance = testComponent.root.find(
        starterHelper.elementByType(FriendForm)
      );

      getByIdCalledTimes = axiosGetByIdSpy?.mock?.calls?.length;
      axiosGetByIdSpy.mockRestore();

      axios.interceptors.response.eject(axiosResInterceptor);

      let friendFormId = friendFormInstance?.parent?.props?.match?.params?.id;

      if (+friendFormId !== +idOfFriendToEdit) {
        hint = `HINT: Make sure the Friend Form component is rendering when the Edit Button is clicked and the URL has the id of the Friend clicked`;
      }

      if (hint) {
        actualMsg = `The Friend Form component is not rendering when the Edit Button is clicked or the URL does not have the id of the Friend clicked`;
      }
    } else {
      actualMsg = !loginWorks
        ? "Login failed. Please make sure your login method is working correctly."
        : "Add Friend Failed, Please make sure your add method is working correctly.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  num++;

  it(`${
    num < 10 ? `0${num}` : num
  } - The Friend Form component should make a call to the friendsService.getById method when it renders if an Id was passed in the Url.`, async () => {
    hint = "";
    let actualMsg,
      expectedMsg = `The Friend Form component should make a call to the friendsService.getById method when it renders if an Id was passed in the Url.`;
    actualMsg = expectedMsg;

    if (getByIdCalledTimes !== 1) {
      hint =
        "HINT: Make sure you're calling the 'getById' method one time when the Friend Form component renders and an Id was passed in the Url.";
    } else if (!isAxiosSuccess) {
      hint =
        "HINT: Make sure your call to the 'getById' is succesful and is returning the correct data.";
    }

    if (hint) {
      actualMsg = `The Friend Form component is not making a call to the 'getById' method correctly`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  num++;

  it(`${
    num < 10 ? `0${num}` : num
  } - On getById success, the Friend Form component should set the correct data in the form state object`, async () => {
    hint = "";
    let formStateProps = [
      "id",
      "title",
      "bio",
      "headline",
      "summary",
      "slug",
      "statusId",
      "primaryImage",
    ];

    let friendFormInstance;

    let actualMsg,
      expectedMsg = `On getById success, the Friend Form component should set the correct data in the form state object`;

    actualMsg = expectedMsg;

    if (isAxiosSuccess) {
      try {
        friendFormInstance = testComponent?.root?.find(
          starterHelper.elementByType(FriendForm)
        );
      } catch {
        actualMsg = "The FriendForm.jsx is not rendering";
      }

      let statePropsExists = formStateProps.every((prop) => {
        let result = false;

        if (
          starterHelper.statePropExists(
            friendFormInstance?._fiber?.memoizedState,
            prop
          )
        ) {
          result = true;
        }

        if (!result) {
          hint += `\nHINT: The ${prop} property does not exist in the form state object.`;
        }

        return result;
      });

      let isStateCorrect = formStateProps.every((prop) => {
        let result = false;
        if (prop === "primaryImage") {
          result =
            friendToEdit[prop]?.imageUrl ===
            starterHelper.getStatePropVal(
              friendFormInstance?._fiber?.memoizedState,
              prop
            );
        } else {
          result =
            friendToEdit[prop] ===
            starterHelper.getStatePropVal(
              friendFormInstance?._fiber?.memoizedState,
              prop
            );
        }

        if (!result) {
          hint += `\nHINT: The ${prop} property in the form state object was not set correctly.`;
        }

        return result;
      });

      if (!isStateCorrect || !statePropsExists) {
        hint +=
          "\nHINT: Make sure you're setting the correct data from the friendsService.getById method to the form state object.";
      }

      if (hint) {
        actualMsg = `The Friend Form component is not setting the correct data from the getById method response to the form state object.`;
      }
    } else {
      actualMsg = "You must pass the last test before you can run this one.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
