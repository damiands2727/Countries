import { create, act as renderAct } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import usersService from "../../../../services/usersService";
import App from "../../../../App";
import Friend from "../../../friends/Friend";
import Friends from "../../../friends/Friends";
import FriendForm from "../../../friends/FriendForm";
import * as starterHelper from "../../starterHelper";
import "../../sabioExpect";
import axios from "axios";

const friendsService = require("../../../../services/friendsService");
const https = require("https");

jest.setTimeout(100000);

let number;

const mockFriend = starterHelper.mockFriend;

const generalErrors = {
  general: {
    message: "Something went wrong while testing your code.",
    hint: "HINT: double check for errors on your code. Make sure you are correctly importing " +
      "and exporting your components and service methods.",
  },
  showFriends: {
    message: "No button for showing friends was found.",
    hint: 'HINT: make sure you added a button with id "show-friends" to your Friends.jsx component',
  },
  addFriend: {
    message: "An error ocurred while using your addFriend method.",
    hint: "HINT: double check your addFriend method on your service file and make sure " +
      "you are correctly exporting it."
  },
}

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.httpsAgent = new https.Agent({ keepAlive: true });
  return config;
});

describe("friendService.js checks", () => {
  starterHelper.serviceFileTests(
    "../../services/friendsService.js",
    "friendsService",
    ["updateFriend"]
  );

  number = starterHelper.numb;
});

describe("Friends useNavigate Test", () => {
  const fs = require("fs");
  let appComponent, friendsInstance, friendsAdded = false;

  beforeAll(async () => {
    await renderAct(async () => {
      await usersService.login(starterHelper.mockUser);
      const testFriends = starterHelper.testAddFriends();
      const addFriend = friendsService.default ? friendsService.default.addFriend : friendsService.addFriend;
      if(!!addFriend) {
        friendsAdded = true;
        await addFriend(testFriends[0]);
      }
    });
  });

  afterAll(async () => {
    appComponent?.unmount();
  });

  it(`${number < 10 ? `0${number}` : number} - Friend.jsx component should import useNavigate hook.`, async () => {
    const expectedMsg = "Friend component should import useNavigate hook.";
    let actualMsg = expectedMsg;
    let hint = "";
    try {
      let file = fs.readFileSync("src/components/friends/Friend.jsx", "utf8");
      file = file.replace(/[^\S\r]+/g, "").replace(/"/g, "'").split("from'react-router-dom'")[0];
      const importIdx = file.lastIndexOf("import");
      const openCurlIdx = file.slice(importIdx)?.lastIndexOf("{");
      const closeCurlIdx = file.slice(importIdx)?.lastIndexOf("}");
      if(file?.slice(importIdx - 2, importIdx) === "//" || file?.slice(importIdx - 2, importIdx) === "/*") {
        hint = "HINT: your useNavigate import statement might be commented out."
      } else if(!file.slice(importIdx).slice(openCurlIdx, closeCurlIdx).includes("useNavigate")){
        hint = "HINT: make sure you are importing useNavigate from react-router-dom.";
      }
      if(hint) {
        actualMsg = "Friend component does not import useNavigate hook.";
      }
    } catch (error) {
      actualMsg = generalErrors.general.message;
      hint = generalErrors.general.hint;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
      number < 10 ? `0${number}` : number
    } - When edit button is clicked, Friend.jsx component should use the useNavigate hook to pass friend data to the FriendForm.jsx component.`, async () => {
      const expectedMsg = "FriendForm.jsx component should receive location data when navigating from edit button.";
      let actualMsg = expectedMsg;
      let hint = "";
      let friendsComponents, componentsAreFriend;

      try {
        if(!friendsAdded) {
          throw new Error(generalErrors.addFriend.message);
        }
        await renderAct(() => {
          appComponent = create(
            <MemoryRouter initialEntries={[ "/friends" ]}>
              <App />
            </MemoryRouter>
          );
          return new Promise(resolve => setTimeout(resolve, 2000));
        });
        
        let showButton = appComponent.root.findByProps({id: "show-friends"});
        await renderAct(() => {
          showButton?.props.onClick();
          return new Promise(resolve => setTimeout(resolve, 200));
        });
        friendsInstance = appComponent?.root?.find(starterHelper.elementByType(Friends));
        friendsComponents = starterHelper.getStatePropVal(friendsInstance?._fiber?.memoizedState, "friendsComponents");
        if(!!!friendsComponents || friendsComponents.length === 0){
          actualMsg = "friendsComponents does not have Friend.jsx elements.";
          hint = "HINT: make sure your Friends.jsx component has the property friendsComponents on state " +
            "with the rendered cards.";
        } else {
          componentsAreFriend = friendsComponents.every(starterHelper.elementByType(Friend));
          if(!componentsAreFriend){
            actualMsg = "One or more of the elements in the friendsComponents array are not " +
              "of type Friend.jsx.";
            hint = "HINT: make sure you are mapping your friends array and your mapping function " +
              "is returning a Friend.jsx component.";
          } else {
            const editBtns = friendsInstance.findAll(node => {
              const children = node.children;
              return children.length === 1 && typeof(children[0]) === "string" && children[0] === "Edit";
            }, { deep: true });
  
            if(editBtns.length > 0) {
              const editBtn = editBtns[0];
              const friendData = friendsComponents[0].props?.friend;
              if(friendData?.id) {
                await renderAct(async () => {
                  editBtn.props.onClick({ preventDefault: () => {} });
                  return new Promise((resolve) => setTimeout(resolve, 2000));
                });
                const friendFormInstance = appComponent?.root?.find(starterHelper.elementByType(FriendForm));
  
                if(!!friendFormInstance) {
                  const getLocationObj = (context) => {
                    const memoizedValue = context?.memoizedValue;
                    if(!memoizedValue) {
                      return null;
                    }
                    if(
                        typeof memoizedValue === "object" &&
                        !Array.isArray(memoizedValue) &&
                        "location" in memoizedValue
                    ) {
                      return memoizedValue.location;
                    }
                    return getLocationObj(context?.next);
                  };
                  const locationObj = getLocationObj(friendFormInstance?._fiber?.dependencies?.firstContext);
                  if(!!locationObj?.state){
                    const { payload, type } = locationObj.state;
                    payload.primaryImage = payload?.primaryImage?.imageUrl ? payload.primaryImage.imageUrl : "";
                    if(!!!payload || !!!type) {
                      actualMsg = "Location object is missing one or more properties.";
                      hint = "HINT: make sure the state in your location object has payload and type " +
                        "properties with correct values.";
                    } else if(type !== "FRIEND_VIEW") {
                      actualMsg = "Location object has incorrect type property.";
                      hint = "HINT: make sure the type property in your location object has the value 'FRIEND_VIEW'.";
                    } else if(
                      !starterHelper.deepEqual(Object.keys(payload), Object.keys(friendData)) ||
                      !!!parseInt(payload?.id)
                      ){
                      actualMsg = "One or more properties of the payload in the location object are incorrect.";
                      hint = "HINT: make sure the payload you are passing to the location object is the friend data " +
                        "from the friend card that was clicked on.";
                    }
                  } else {
                    actualMsg = "FriendForm.jsx component did not receive location data.";
                    hint = "HINT: make sure you are passing a location object when you navigate to the FriendForm.jsx " +
                      "component on edit button clicked. Location object should be an object with a shape like " +
                      "{ state: { payload, type: 'FRIEND_VIEW' }, where payload is a friend object.";
                  }
                } else {
                  actualMsg = "FriendForm.jsx component not found.";
                  hint = "HINT: make sure you are navigating to the /friends/:id url when edit button " +
                    "is clicked."
                }
              } else {
                actualMsg = "No friend data found in your Friend.jsx component.";
                hint = "HINT: make sure you are passing a 'friend' property to your Friend.jsx component " +
                  "with the data for each friend in your friendArray.";
              }
            } else {
              actualMsg = "No edit button found.";
              hint = "HINT: make sure you are rendering an edit button in your Friend.jsx component.";
            }
          }
        }
      } catch (error) {
        if(actualMsg === expectedMsg) {
          if(error.message === generalErrors.addFriend.message) {
            actualMsg = generalErrors.addFriend.message;
            hint = generalErrors.addFriend.hint;
          }
          else if(error.message.includes("show-friends")) {
            actualMsg = generalErrors.showFriends.message;
            hint = generalErrors.showFriends.hint;
          }
          else {
            actualMsg = generalErrors.general.message;
            hint = generalErrors.general.hint;
          }
        }
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;
});

describe("Friends useLocation Test", () => {

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    await renderAct(async () => {
      await usersService.login(starterHelper.mockUser);
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx component should not make a call to friendsService.getById when location state is passed.`, async () => {
    const expectedMsg = "Friend Form component should not make a call to " +
      "friendsService.getById when friend data is being passed in the location state.";
    const payload = { ...mockFriend };
    payload.primaryImage = {
      id: 10,
      entityId: 10,
      imageTypeId: "Main",
      imageUrl: payload.primaryImage,
    };
    const endpoint = "https://api.remotebootcamp.dev/api/friends/";
    let actualMsg = expectedMsg,
      hint = "",
      getByIdReqCount = 0;
    
    try {
      let axiosGetByIdSpy;
      if(friendsService.default) {
        axiosGetByIdSpy = jest.spyOn(friendsService.default, "getById");
      } else if(friendsService.getById) {
        axiosGetByIdSpy = jest.spyOn(friendsService, "getById");
      } else {
        actualMsg = "No friendsService.getById method found.";
        hint = "HINT: make sure you are exporting the getById method in your service file.";
        throw new Error("No getById method found in service file.");
      }
      let axiosReqInterceptor = axios.interceptors.request.use((config) => {
        if(config.url.includes(endpoint) && !isNaN(config.url.split(endpoint)[1])) {
          getByIdReqCount++;
        }
        return config;
      });
      
      payload.id = 1;
      const state = { payload, type: "FRIEND_VIEW" };
  
      await renderAct(async () => {
        create(
          <MemoryRouter initialEntries={[{ pathname: `/friends/${payload.id}`, state }]}>
            <App />
          </MemoryRouter>
        );
      });
  
      const getByIdCalls = axiosGetByIdSpy?.mock?.calls?.length;
  
      axios.interceptors.request.eject(axiosReqInterceptor);
  
      if(getByIdCalls > 0 || getByIdReqCount > 0) {
        hint = "HINT: Make sure you are you are using useLocation hook " +
          "and you don't make a getById service call when friend data is provided.";
        if(getByIdCalls > 0) {
          actualMsg = `getById was called ${getByIdCalls === 1 ? "once" : `${getByIdCalls} times`} when rendering Friend Form.`;
        } else {
          actualMsg = `${getByIdReqCount} ${getByIdReqCount === 1 ? "was" : "were"} made to the get friend by id endpoint when rendering Friend Form.`;
        }
      }
    } catch (error) {
      if(actualMsg === expectedMsg) {
        actualMsg = "Something went wrong while testing the FriendForm.jsx component.";
        hint = generalErrors.hint;
      }
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx component should properly update its state when passing friend data through location.`, async () => {
    const expectedMsg = "FriendForm.jsx state properly updates when the data is passed through location.";
    // Added --- so values does not match by coincidence with whatever dafault may be used.
    const payload = {
      id: -1,
      bio: "--- bio ---",
      title: "--- title ---",
      summary: "--- summary ---",
      headline: "--- headline ---",
      slug: "--- slug ---",
      primaryImage: "--- https://sabio.la/images/logo.png ---",
    };
    payload.primaryImage = {
      id: -10,
      entityId: -10,
      imageTypeId: "--- Main ---",
      imageUrl: payload.primaryImage,
    };
    let formComponent, actualMsg, hint;
    
    actualMsg = expectedMsg;

    try {
      let state = { payload: { ...payload } };
  
      await renderAct(async () => {
        formComponent = create(
          <MemoryRouter initialEntries={[{ state }]}>
            <FriendForm />
          </MemoryRouter>
        );
      });
      let formInstance = formComponent.root.find(starterHelper.elementByType(FriendForm));
      let formState = formInstance._fiber.memoizedState.baseState;
  
      // Making sure the state does not update when the type on location is not the correct one
      for(const key of Object.keys(payload)) {
        if((key !== "primaryImage" && formState[key] === payload[key]) ||
            (key === "primaryImage" && formState[key] === payload[key]?.imageUrl)
          ) {
            actualMsg = "FriendForm.jsx state should not update its state when friend data is passed through " +
              "location state with the incorrect location type.";
            hint = "HINT: Make sure you are checking that the 'type' property of the location object has " +
              "the value 'FRIEND_VIEW'.";
            break;
        }
      }
  
      state.type = "FRIEND_VIEW";
  
      await renderAct(async () => {
        formComponent = create(
          <MemoryRouter initialEntries={[{ state }]}>
            <FriendForm />
          </MemoryRouter>
        );
      });
      formInstance = formComponent.root.find(starterHelper.elementByType(FriendForm));
      formState = formInstance._fiber.memoizedState.baseState;
  
      // Now the state should be updated
      for(const key of Object.keys(payload)) {
        if((key !== "primaryImage" && formState[key] !== payload[key]) ||
            (key === "primaryImage" && formState[key] !== payload[key]?.imageUrl)
          ) {
            actualMsg = "FriendForm.jsx state should properly update its state when friend data is passed through " +
              "location state.";
            hint = "HINT: Make sure you are using the useLocation hook. The location object have the properties " +
              "'payload' and 'type', the first one being a friend object and the second one having the value 'FRIEND_VIEW'."
            if(key === "primaryImage") {
              hint += " Remember to unpack the imageUrl property from the primaryImage object for your form input."
            }
            hint += "\n\nHINT: FriendForm.jsx state should capture the following properties from location payload: " +
              JSON.stringify(Object.keys(payload).join(", ")).replace(/"/g, "") + ".";
            break;
        }
      }
    } catch (error) {
      if(actualMsg === expectedMsg) {
        actualMsg = generalErrors.general.message;
        hint = generalErrors.general.hint;
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;
});