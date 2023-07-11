import React from "react";
import usersService from "../../../../services/usersService";
import "../../sabioExpect";
import * as helper from "../../starterHelper";
import { create, act as renderAct } from "react-test-renderer";
import Friends from "../../../friends/Friends";
import axios from "axios";
const https = require("https");

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.httpAgent = new https.Agent({ keepAlive: true });
  return config;
});

describe("Friends Component State", () => {
  let component;
  jest.setTimeout(8000);
  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    await renderAct(async () => {
      await usersService.login({
        email: "robrukavinadev@gmail.com",
        password: "12ThisPassword!",
        tenantId: "U013T5Q989Y",
      });
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
    await renderAct(() => {
      component = create(<Friends />);
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  afterAll(() => {
    component.unmount();
  });

  it("Friends.jsx should have a state property called arrayOfFriends and it should be an array.", async () => {
    const dataAr = helper.getStatePropVal(
      component.root._fiber.memoizedState,
      "arrayOfFriends"
    );
    let type = Array.isArray(dataAr);

    let hasStates = "The state property arrayOfFriends exists and is an array.";
    let failureMessage =
      "The state property arrayOfFriends was not found or is not an array.";

    if (type) {
      failureMessage =
        "The state property arrayOfFriends exists and is an array.";
    }

    expect(failureMessage).sabioToBe(
      hasStates,
      "HINT: useState should be created as an object with two nested arrays. One of those should be arrayOfFriends."
    );
  });

  it("Friends.jsx should have a state property called friendsComponents and it should be an array.", async () => {
    const compAr = helper.getStatePropVal(
      component.root._fiber.memoizedState,
      "friendsComponents"
    );
    let type = Array.isArray(compAr);
    let hasStates =
      "The state property friendsComponents exists and is an array.";
    let failureMessage =
      "The state property friendsComponents was not found or is not an array.";

    if (type) {
      failureMessage =
        "The state property friendsComponents exists and is an array.";
    }

    expect(failureMessage).sabioToBe(
      `${hasStates}`,
      "HINT: useState should be created as an object with two nested arrays. One of those should be friendsComponents."
    );
  });

  it("Friends.jsx state object should have two arrays: arrayOfFriends and friendsComponents. They should both have the same length and it should be greater than 0", async () => {
    const dataAr = helper.getStatePropVal(
      component.root._fiber.memoizedState,
      "arrayOfFriends"
    );

    const compAr = helper.getStatePropVal(
      component.root._fiber.memoizedState,
      "friendsComponents"
    );
    let hasStates =
      "arrayOfFriends and friendsComponents have the same length and that length is greater than 0.";
    let failureMessage =
      "arrayOfFriends and friendsComponents have the same length and that length is greater than 0.";

    let dataLength = dataAr ? dataAr.length : 0;
    let componentLength = compAr ? compAr.length : 0;

    if (!(dataLength > 0)) {
      failureMessage =
        "arrayOfFriends does not have a length greater than 0.\n";
    }
    if (!(componentLength > 0)) {
      if (!(dataLength > 0)) {
        let oldFail = failureMessage;
        failureMessage =
          oldFail +
          "friendsComponents does not have a length greater than 0.\n";
      } else {
        failureMessage =
          "friendsComponents does not have a length greater than 0.\n";
      }
    }
    if (dataLength !== componentLength) {
      if (
        failureMessage ===
        "arrayOfFriends and friendsComponents have the same length and that length is greater than 0."
      ) {
        failureMessage =
          "arrayOfFriends and friendsComponents are arrays, BUT: " +
          "\n" +
          "The length of arrayOfFriends and friendsComponents do not match.\n";
      } else if (!(dataLength > 0) && !(componentLength > 0)) {
        failureMessage =
          "arrayOfFriends and friendsComponents are arrays BUT: " +
          "\n" +
          "The length of arrayOfFriends and friendsComponents are not the same and are not greater than 0.\n";
      } else {
        failureMessage =
          "The length of arrayOfFriends and friendsComponents do not match.\n";
      }
    }

    expect(failureMessage).sabioToBe(
      hasStates,
      "HINT: Make sure on useEffect you are mapping the response \n" +
        "from your api call into a separate array stored in your state object.\n"
    );
  });
});
