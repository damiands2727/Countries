import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "../../../../App";
import Friends from "../../../friends/Friends";
import renderer, { act as renderAct } from "react-test-renderer";
import usersService from "../../../../services/usersService";
import "../../sabioExpect";
import axios from "axios";
import https from "https";
import * as starterHelper from "../../starterHelper";
let friendsService = require("../../../../services/friendsService");
let number = starterHelper.numb;

jest.setTimeout(50000);
axios.interceptors.request.use((config) => {
   config.withCredentials = true;
   config.httpAgent = new https.Agent({ keepAlive: true });
   return config;
});

if (friendsService.default) {
   friendsService = friendsService.default;
} else if (friendsService.friendsService) {
   friendsService = friendsService.friendsService;
}

describe("Service file", () => {
   let pathToService = "../../services/friendsService";
   let serviceName = "friendsService";
   let expMethods = ["getFriends"];
   let component;
   let loginError = "";

   beforeAll(async () => {
      global.IS_REACT_ACT_ENVIRONMENT = true;
      axios.interceptors.request.use((config) => {
         config.withCredentials = true;
         config.httpAgent = new https.Agent({ keepAlive: true });
         return config;
      });

      await renderAct(async () => {
         try {
            await usersService.login({
               email: "randomUser@user.com",
               password: "12ThisPassword!",
               tenantId: "TestUser",
            });
         } catch {
            loginError =
               "User login failed. You are unauthorized to use this endpoint\nHINT:Make sure your login function works";
         }
      });
   });

   afterEach(() => {
      jest.restoreAllMocks();
      component?.unmount();
   });

   starterHelper.serviceFileTests(pathToService, serviceName, expMethods);

   number = starterHelper.numb;

   it(`${
      number < 10 ? `0${number}` : number
   } - friendService getFriends function has the right config`, async () => {
      let actualMsg,
         expectedMsg =
            "Expected getFriends to have been called with the correct request config";
      var requestErrors = "";
      let hint;

      try {
         let axiosSpy = jest.spyOn(friendsService, "getFriends");
         let axiosReqInterceptor = axios.interceptors.request.use(
            (request) => {
               const crossdomain = request.crossdomain; //true
               const method = request.method; //"get"
               const withCredentials = request.withCredentials; //true
               const headers = request.headers["Content-Type"]; //"application/json"

               if (crossdomain !== true) {
                  requestErrors += "\n 'crossdomain' property is not set to true";
               }
               if (method !== "get") {
                  requestErrors += "\n 'method' property is not set to 'GET'";
               }
               if (withCredentials !== true) {
                  requestErrors +=
                     "\n 'withCredentials' property is not set to 'true'";
               }
               if (headers !== "application/json") {
                  requestErrors +=
                     "\n 'headers' property is not set to { 'Content-Type': 'application/json' }";
               }

               if (requestErrors) {
                  actualMsg = requestErrors;
               }
            },

            (err) => {
               return Promise.reject(err);
            }
         );

         await renderAct(async () => {
            component = renderer.create(
               <MemoryRouter>
                  <Friends />
               </MemoryRouter>
            );
         });

         axios.interceptors.request.eject(axiosReqInterceptor);

         if (!actualMsg) {
            actualMsg = expectedMsg;
         }

         if (!!loginError) {
            actualMsg = loginError;
         } else {
            if (axiosSpy.mock.calls.length === 0) {
               actualMsg = "getFriends was not called";
               hint = "HINT: remember to use a useEffect hook to call the service";
            }
         }
      } catch {
         actualMsg = "getFriends was not called correctly";
         hint =
            "HINT: Make sure you are using the correct config for the getFriends function";
      }

      expect(actualMsg).sabioToBe(expectedMsg, hint);
   });
   number++;
   it(`${
      number < 10 ? `0${number}` : number
   } -friendService getFriends was called with the correct parameters`, async () => {
      let actualMsg;
      let expectedMsg = "Expected getFriends to have been called";
      actualMsg = expectedMsg;
      let isAxiosSuccessful = false;
      let hint;
      let pageIndexValue = -5;
      let pageSizeValue = -10;
      let axiosResInterceptor;

      try {
         axiosResInterceptor = axios.interceptors.request.use((config) => {
            let method = config?.method;
            let urlParams = config?.url?.split("?")[1]?.split("&");

            if (!!!urlParams) {
               actualMsg =
                  "Nor pageIndex or pageSize parameters were found in the URL";
               hint =
                  "HINT: Make sure you are correctly writting your getFriends URL in your service file";
            }

            let pageIndex = urlParams[0];
            let pageSize = urlParams[1];

            if (!method === "get") {
               actualMsg = "getFriends was not called with the correct method";
               hint =
                  "HINT: Make sure you are using the correct method ('GET') for the getFriends function";
            }

            if (
               (pageIndex.includes("pageIndex=") && pageSize.includes("pageSize=")) ||
               (pageSize.includes("pageIndex=") && pageIndex.includes("pageSize="))
            ) {
               if (!isNaN(pageIndex.split("=")[1]) && !isNaN(pageSize.split("=")[1])) {
                  if (
                     parseInt(pageIndex.split("=")[1]) === pageIndexValue &&
                     parseInt(pageSize.split("=")[1]) === pageSizeValue
                  ) {
                     isAxiosSuccessful = true;
                  } else {
                     actualMsg =
                        "The pageIndex and pageSize are not in the correct order or have hardcoded values";
                     hint =
                        "HINT: Make sure you don't have hardcoded values or that you are not missplacing the order implementation of the pageIndex and pageSize parameters in your URL";
                  }
               } else {
                  actualMsg =
                     "Incorrect values in one or both pageIndex and pageSize parameters";
                  hint =
                     "HINT: Make sure you are passing integer values for the pageIndex and pageSize parameters. Double check your service and service call";
               }
            } else {
               actualMsg =
                  "Either pageIndex or pageSize is missing from the getFriends axios call";
               hint =
                  "HINT: Make sure you are adding pageIndex and pageSize to the getFriends URL in your service file";
            }
            if (config.url.includes("friends") && config.url.includes("pageIndex")) {
               isAxiosSuccessful = true;
            }
            return config;
         });

         let axiosSpy = jest.spyOn(friendsService, "getFriends");

         await renderAct(async () => {
            await friendsService.getFriends(pageIndexValue, pageSizeValue);
         });

         await renderAct(async () => {
            component = renderer.create(
               <MemoryRouter>
                  <Friends />
               </MemoryRouter>
            );
         });

         if (!!loginError) {
            actualMsg = loginError;
         } else {
            let usingUseEffect = false;
            let friendsInstance = component?.root?.find(
               starterHelper.elementByType(Friends)
            );
            if (!!friendsInstance) {
               if (!!friendsInstance?._fiber?._debugHookTypes) {
                  usingUseEffect =
                     friendsInstance._fiber._debugHookTypes.includes("useEffect");
               }
            }
            if (axiosSpy.mock.calls.length === 0 || !usingUseEffect) {
               actualMsg =
                  "getFriends was not called or you are not implementing the 'useEffect' hook'";
            } else if (!isAxiosSuccessful) {
               actualMsg =
                  "'getFriends' service was called but with incorrect parameters. Make sure your config object is setup correctly, and that you're passing in the correct parameters.";
               hint =
                  "HINT: Make sure you are adding pageIndex and pageSize to the getFriends URL in your service file & also that you are passing the correct values. Remember not to hardcode values in your getFriends service URL";
            }
         }
      } catch (error) {
         if (actualMsg === expectedMsg && error.response?.status !== 404) {
            actualMsg = "Something went wrong while rendering.";
            hint = "HINT: Double check for errors in your code";
         }
      } finally {
         axios.interceptors.request.eject(axiosResInterceptor);
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
   });
});
number++;
describe("Components", () => {
   let component;

   afterEach(() => {
      component?.unmount();
   });

   it(`${
      number < 10 ? `0${number}` : number
   }  - You don't have any Friend Card rendered in App.jsx`, () => {
      let actualMsg,
         expectedMsg = "You do not have any friends cards on the App.jsx";
      let cards;
      let hint = "";

      component = renderer.create(
         <MemoryRouter initialEntries={[""]}>
            <App />
         </MemoryRouter>
      );

      let divs = component?.root?.findAllByType("div");

      cards = divs?.filter(starterHelper.filterCards);
      if (divs) {
         if (cards.length > 0) {
            actualMsg = "Make sure Friends.jsx is rendered at the correct route";
            hint = `Cards are rendered on App.jsx, we found ${cards.length}`;
         } else {
            actualMsg = expectedMsg;
         }
      } else {
         actualMsg = "Your App.jsx has an error and wont render";
         hint = "HINT: Check if your App.jsx for sintax errors";
      }

      expect(actualMsg).sabioToBe(expectedMsg, hint);
   });
   number++;
   it(`${
      number < 10 ? `0${number}` : number
   } - The 'Friends' component is a functional component and renders on the DOM`, async () => {
      let actualMsg,
         expectedMsg = `You are using a 'Functional' component.`;
      let hint = "";

      await renderAct(() => {
         component = renderer.create(
            <MemoryRouter>
               <Friends />
            </MemoryRouter>
         );
      });

      let isClassComp = component?.root?.find(starterHelper.elementByType(Friends));

      if (isClassComp._fiber.elementType.toString().split(" ")[0] === "class") {
         actualMsg = `You are using a 'Class' component and you should be using a 'Functional' component for Friends.jsx.`;
      } else {
         actualMsg = expectedMsg;
      }

      expect(actualMsg).sabioToBe(expectedMsg, hint);
   });

   number++;

   it(`${
      number < 10 ? `0${number}` : number
   }  - Friends.jsx has a route in App.jsx`, async () => {
      let expectedMsg, actualMsg, hint, friendInstance;
      hint =
         "HINT: Make sure you named your component Friends.jsx and that it is rendered at the '/friends' route.";
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
         }
      } catch (error) {
         actualMsg = "Your Friends component won't render.";
         hint = "Check for errors in your code.";
      }
      component.unmount();
      expect(actualMsg).sabioToBe(expectedMsg, hint);
   });
   number++;
   describe("Rendering Friends from an axios call", () => {
      let component;

      beforeAll(async () => {
         global.IS_REACT_ACT_ENVIRONMENT = true;
         axios.interceptors.request.use((config) => {
            config.withCredentials = true;
            config.httpAgent = new https.Agent({ keepAlive: true });
            return config;
         });

         await renderAct(async () => {
            try {
               await usersService.login({
                  email: "randomUser@user.com",
                  password: "12ThisPassword!",
                  tenantId: "TestUser",
               });
            } catch (err) {
               console.log(err);
            }
         });
      });

      afterEach(() => {
         jest.restoreAllMocks();
         component?.unmount();
      });

      it(`${
         number < 10 ? `0${number}` : number
      } - useEffect hook is being implemented in Friends`, async () => {
         let expectedMsg = "You are importing and implementing the 'useEffect' hook";
         let actualMsg;
         let hint;
         let usingUseEffect = false;

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
               usingUseEffect =
                  friendsInstance._fiber._debugHookTypes.includes("useEffect");
            }
         }
         if (usingUseEffect) {
            actualMsg = expectedMsg;
         } else {
            actualMsg = "'useEffect' hook was not found in Friends.jsx";
            hint = "HINT:Make sure you are importing the 'useEffect' hook";
         }

         expect(actualMsg).sabioToBe(expectedMsg, hint);
      });
      number++;
      it(`${
         number < 10 ? `0${number}` : number
      }  - useState hook is being implemented in Friends`, async () => {
         let expectedMsg = "You are importing and implementing the 'useState' hook";
         let actualMsg;
         let hint;
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
                  friendsInstance._fiber._debugHookTypes.includes("useState");
            }
         }
         if (usingUseState) {
            actualMsg = expectedMsg;
         } else {
            actualMsg = "'useState' hook was not found in Friends.jsx";
            hint = "HINT:Make sure you are importing the 'useState' hook";
         }

         expect(actualMsg).sabioToBe(expectedMsg, hint);
      });
      number++;
      it(`${
         number < 10 ? `0${number}` : number
      } - There is at least one Friend card rendering`, async () => {
         let actualMsg,
            expectedMsg = "You have friends cards on the DOM";
         let hint;

         await renderAct(async () => {
            component = renderer.create(
               <MemoryRouter>
                  <Friends />
               </MemoryRouter>
            );
            return new Promise((resolve) => setTimeout(resolve, 2000));
         });

         let divs = component?.root?.findAllByType("div");
         const cards = divs.filter(starterHelper.filterCards);

         if (cards.length > 0) {
            actualMsg = expectedMsg;
         } else {
            actualMsg = "There are no friends cards on the DOM";
            hint = "HINT: did you added some in the API Bootcamp?";
         }

         expect(actualMsg).sabioToBe(expectedMsg, hint);
      });
   });
   number++;
});
