import { create, act as renderAct } from "react-test-renderer";
import { Link, MemoryRouter } from "react-router-dom";
import App from "../../../../App";
import FriendForm from "../../../friends/FriendForm";
import Friends from "../../../friends/Friends";
import * as helper from "../../starterHelper";
import "../../sabioExpect";
import axios from "axios";
import toastr from "toastr";

let usersService = require("../../../../services/usersService");
let friendsService = require("../../../../services/friendsService");
const https = require("https");

jest.setTimeout(100000);

if (friendsService.default) {
  friendsService = friendsService.default;
} else if (friendsService.friendsService) {
  friendsService = friendsService.friendsService;
}

if (usersService.default) {
  usersService = usersService.default;
} else if (usersService.usersService) {
  usersService = usersService.usersService;
}

let number, req, idFromRes;
const expectedInputs = [
  "title",
  "bio",
  "summary",
  "headline",
  "slug",
  "primaryImage",
];

const expProps = [
  "id",
  "title",
  "bio",
  "summary",
  "headline",
  "slug",
  "statusId",
  "primaryImage",
];

const minAddProps = [
  "title",
  "bio",
  "summary",
  "headline",
  "slug",
  "statusId",
  "primaryImage",
];

function findState(formComponent) {
  const getMemoStates = (memoState, prevState = []) => {
    if (!!memoState?.memoizedState) {
      prevState.push(memoState.memoizedState);
    }
    if (!memoState?.next) {
      return prevState;
    }
    return getMemoStates(memoState.next, prevState);
  };

  let formInstance = formComponent?.root?.find(
    helper.elementByType(FriendForm)
  );
  const memoStates = getMemoStates(formInstance?._fiber?.memoizedState);

  const foundObject = memoStates.find((obj) =>
    expectedInputs.every((key) => obj.hasOwnProperty(key))
  );
  return foundObject;
}

const mockFriend = helper.mockFriend;

axios.interceptors.request.use((config) => {
  config.httpsAgent = new https.Agent({ keepAlive: true });
  req = config;
  return config;
});

axios.interceptors.response.use((res) => {
  if (req?.url?.includes("/friends") && req?.method === "post") {
    idFromRes = res.data.item;
    mockFriend.id = idFromRes;
  }
  return res;
});

describe("friendService.js checks", () => {
  helper.serviceFileTests(
    "../../services/friendsService.js",
    "friendsService",
    ["addFriend", "updateFriend"]
  );

  number = helper.numb;
});

describe("App.jsx has a route for '/friends/new' where FriendForm.jsx is rendered.", () => {
  let formComponent;
  beforeAll(async () => {
    await renderAct(async () => {
      await usersService.login(helper.mockUser);
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx renders at the route: '/friends/new'.`, async () => {
    let expectedMsg, actualMsg, hint, friendForm;
    expectedMsg = "FriendForm.jsx was found at the '/friends/new' route.";

    let routeIsIncluded = false;
    let routeIsNotIncluded = false;

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter initialEntries={["/friends/new"]}>
            <App />
          </MemoryRouter>
        );
      });

      friendForm = formComponent?.root?.findAll(
        helper.elementByType(FriendForm)
      );

      if (friendForm && friendForm.length !== 0) {
        routeIsIncluded = true;
      }

      formComponent.unmount();

      await renderAct(() => {
        formComponent = create(
          <MemoryRouter initialEntries={[""]}>
            <App />
          </MemoryRouter>
        );
      });
      try {
        friendForm = formComponent?.root?.findAll(
          helper.elementByType(FriendForm)
        );
        if (friendForm && friendForm.length !== 0) {
          routeIsNotIncluded = true;
        }
      } catch (error) {
        actualMsg = "Your App component won't render.";
        hint = "Check for errors in your code.";
      }

      if (routeIsIncluded && !routeIsNotIncluded) {
        actualMsg = expectedMsg;
      } else if (routeIsIncluded && routeIsNotIncluded) {
        actualMsg = "you are rendering FriendForm.jsx directly in App.jsx";
      } else {
        actualMsg = "FriendForm.jsx was not found at the '/friends/new' route";
        hint =
          "HINT: Make sure you named your component FriendForm.jsx and that it is rendered at the '/friends/new' route.";
      }
    } catch (error) {
      actualMsg = "Your FriendForm component won't render.";
      hint = "HINT: Check for sintax errors in your FriendForm.";
    }

    formComponent.unmount();
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx is a FUNCTIONAL component.`, async () => {
    let expectedMsg, actualMsg, hint;
    expectedMsg = "FriendForm.jsx is a functional component.";
    actualMsg = expectedMsg;

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });
      try {
        let isClassComp =
          formComponent.root._fiber.memoizedProps.children.type
            .toString()
            .split(" ")[0] === "class";

        if (isClassComp) {
          actualMsg = "FriendForm.jsx is not a functional component.";
          hint =
            "HINT: Make sure your FriendForm.jsx is not a class component.";
        }
      } catch (error) {
        actualMsg = "Your FriendForm component won't render.";
        hint = "HINT: Remember we won't be using class components anymore.";
      }
    } catch (error) {
      actualMsg = "Your FriendForm component won't render.";
      hint = "HINT: Remember we won't be using class components anymore.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Friends.jsx has a button for Add Friend`, async () => {
    let expectedMsg, actualMsg, hint, friendsComponent, link, anchor;
    expectedMsg = "Friends.jsx has a button for Add Friend";
    actualMsg = expectedMsg;

    try {
      await renderAct(() => {
        friendsComponent = create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
      });

      link = friendsComponent.root
        .findAll(helper.elementByType(Link))
        .find((b) => b.props.children === "Add Friend");

      anchor = friendsComponent.root
        .findAllByType("a")
        .find((b) => b.props.children === "Add Friend");

      if (!link && !anchor) {
        actualMsg = "Friends.jsx does not have a button for adding a friend.";
        hint =
          "HINT: Make sure you have a Link or anchor tag that has the text 'Add Friend' and className of 'btn btn-primary' in your Friends.jsx";
      }
    } catch (error) {
      actualMsg =
        "Friends.jsx won't render or does not have a button for adding a friend.";
      hint =
        "HINT: Make sure you have a Link or anchor tag that has the text 'Add Friend' and className of 'btn btn-primary' in your Friends.jsx";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - When the 'Add Friend' button is clicked, the url changes to /friends/new.`, async () => {
    let expectedMsg, actualMsg, link, hint, component, anchor;
    expectedMsg =
      "The 'Add Friend' button changes the browser url to '/friends/new'";

    try {
      await renderAct(() => {
        component = create(
          <MemoryRouter>
            <Friends />
          </MemoryRouter>
        );
        return new Promise((resolve) => setTimeout(resolve, 2000));
      });

      link = component.root
        .findAll(helper.elementByType(Link))
        .find((b) => b?.props?.children === "Add Friend");

      anchor = component.root
        .findAllByType("a")
        .find((b) => b?.props?.children === "Add Friend");

      if (link) {
        if (!link.props.to) {
          actualMsg =
            "The 'Add Friend' button does not have the 'to' property set to '/friends/new'";
          hint =
            "HINT: when using a 'Link' make sure you have a 'to' property.";
        } else if (link?.props?.to !== "/friends/new") {
          actualMsg =
            "The 'Add Friend' button does not change the browser url to '/friends/new'";
          hint =
            "HINT: If you are using a 'Link' make sure you have the correct value in the 'to' prop.";
        } else {
          actualMsg = expectedMsg;
        }
      } else {
        if (!anchor) {
          actualMsg = "Friends.jsx does not have a button for Add Friend";
          hint =
            "HINT: Make sure you have a button with the text 'Add Friend' in your Friends.jsx";
        } else if (!anchor.props.href) {
          actualMsg =
            "The 'Add Friend' button does not change the browser url to '/friends/new'";
          hint =
            "HINT: If you are using a button witn an 'a' tag make sure you have an 'href' attribute";
        } else if (anchor?.props?.href !== "/friends/new") {
          actualMsg =
            "The 'Add Friend' button does not change the browser url to '/friends/new'";
          hint =
            "HINT: If you're using an anchor tag make sure to have the correct value in the 'href' attribute.";
        } else {
          actualMsg = expectedMsg;
        }
      }
    } catch (error) {
      actualMsg = "Friends.jsx does not have a button for Add Friend";
      hint =
        "HINT: Make sure you have a button with the text 'Add Friend' in your Friends.jsx";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});

number++;

describe("FriendForm.jsx contains a form.", () => {
  let formComponent;
  beforeAll(async () => {
    await renderAct(async () => {
      await usersService.login(helper.mockUser);
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx has a form in it.`, async () => {
    let expectedMsg, actualMsg, hint;
    expectedMsg = "FriendForm.jsx contains a form.";
    actualMsg = expectedMsg;
    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      let form = formComponent?.root?.findAllByType("form");

      if (form.length === 0) {
        actualMsg = "FriendForm.jsx does not contain a form.";
        hint =
          "HINT: Make sure your FriendForm.jsx has a form in the return statement.";
      }
    } catch (error) {
      actualMsg = "FriendForm.jsx does not contain a form.";
      hint = "HINT: Check the bootstrap page for the correct form syntax.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The form in FriendForm.jsx has the following fields: title, bio, summary, headline, slug, and primaryImage.`, async () => {
    let expectedMsg,
      actualMsg,
      hint,
      missingInputs = [],
      foundInputs = [];
    expectedMsg =
      "The form in FriendForm.jsx has the following fields: title, bio, summary, headline, slug, and primaryImage.";
    actualMsg = expectedMsg;

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });
      const inputs = formComponent?.root?.findAllByType("input");

      inputs.forEach((i) => {
        foundInputs.push(i.props.name);
      });
      expectedInputs.forEach((input) => {
        if (!foundInputs.some((a) => a === input)) {
          missingInputs.push(input);
        }
      });

      if (missingInputs.length > 0) {
        missingInputs.forEach((input) => {
          if (actualMsg !== expectedMsg) {
            actualMsg += `\nThe form in FriendForm.jsx does not have a field named ${input}.`;
          } else {
            actualMsg = `\nThe form in FriendForm.jsx does not have a field named ${input}.`;
          }
        });
      }
    } catch (error) {
      actualMsg =
        "FriendForm.jsx does not contain a form, or said form does not have the correct fields.";
      hint = "HINT: Check the bootstrap page for examples of forms.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx has a state defined with the following properties: id, title, bio, summary, headline, slug, statusId, and primaryImage.`, async () => {
    let formComponent,
      hint,
      actualMsg,
      expectedMsg =
        "FriendForm.jsx has a state defined with the correct properties.",
      foundProps = [],
      missingProps = [],
      missingString = "";
    let formState;
    actualMsg = expectedMsg;
    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      formState = findState(formComponent);
      if (!formState) {
        actualMsg = "FriendForm.jsx does not have a defined state.";
        hint =
          "HINT: Make sure you're using the useState hook correctly to set a default state object.";
      }
      if ([formState].length > 0) {
        Object.keys(formState).forEach((key) => {
          foundProps.push(key);
        });

        expProps.forEach((prop) => {
          if (!foundProps.some((b) => b === prop)) {
            missingProps.push(prop);
          }
        });

        if (missingProps.length > 0) {
          missingProps.forEach((prop) => {
            missingString === ""
              ? (missingString = `${prop}`)
              : (missingString += `\n${prop}`);
          });
          actualMsg = `FriendForm.jsx state is defined, but it is missing these properties:\n${missingString}`;
          hint =
            "HINT: Make sure you have all the necessary properties in the state object";
        }
      }
    } catch (error) {
      actualMsg = `FriendForm.jsx state is not defined.`;
      hint = "HINT: Did you remember to import the useState hook?.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Each form input uses the same onChange function`, async () => {
    let formComponent,
      hint,
      actualMsg,
      inputs,
      tempInput,
      expectedMsg =
        "There is ONE onChange function that is used by all the form's input's.";
    actualMsg = expectedMsg;

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      inputs = formComponent.root.findAllByType("input");

      for (let i = 0; i < inputs.length; i++) {
        let a = inputs[i];
        if (a?.props?.onChange?.name === undefined) {
          actualMsg =
            "One or more inputs do not have an onChange attribute assigned a value";
          hint =
            "HINT: Make sure all the inputs on the form have an onChange attribute assigned with your \n" +
            "with your onChange function as the value";
          break;
        }
        if (i === 0) {
          tempInput = a?.props?.onChange?.name;
        } else if (tempInput !== a?.props?.onChange?.name) {
          actualMsg = `Each input is not using the same onChange function. \n
      We found ${tempInput} on one and ${a?.props?.onChange?.name} on another`;
          hint =
            "Make sure to use the same onChange function in every input. One form === ONE onChange function";
          break;
        }
      }
    } catch (error) {
      actualMsg = `You don't have inputs or the inputs are missing the onChange attribute.`;
      hint = "Make sure your inputs have an onChange attribute assigned.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - When any input's value is changed, the state is updated to hold the new value of that input.`, async () => {
    let actualMsg,
      hint = "",
      formComponent,
      inputs,
      formState1,
      formState2,
      expectedMsg =
        "The state that belongs to your form is updated when an input's value is changed.";
    actualMsg = expectedMsg;

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      inputs = formComponent.root.findAllByType("input");

      formState1 = findState(formComponent);
      mockFriend.slug = mockFriend.slug += new Date().toISOString();

      await renderAct(async () => {
        await inputs.forEach((input) => {
          let name = input.props.name;
          let value = mockFriend[name];
          let event = { target: { name: name, value: value } };
          input.props.onChange(event);
        });
        formComponent.update(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      formState2 = findState(formComponent);

      let missingPropsMessage = "";
      for (let key in formState2) {
        if (key !== "id" && mockFriend[key] !== formState2[key]) {
          missingPropsMessage += `\n The ${key} was not updated properly.`;
        }
      }

      if (formState1 === formState2 || formState2 === undefined) {
        actualMsg =
          "The state that corresponds to your form is not being updated when an input's value is changed.";
        hint =
          "HINT: Make sure you're using your setState function correctly in your onChange function to update the right state object.";
      } else if (!!missingPropsMessage) {
        actualMsg =
          "The state that corresponds to your form is not being updated correctly.";
        hint = `HINT: ${missingPropsMessage}`;
      }
    } catch (error) {
      actualMsg =
        "The state belonging to your form is not being updated when an input's value is changed.";
      hint = "HINT: Remember to declare your updater function.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - FriendForm.jsx's form has a 'Submit' button that is a 'submit' type.`, async () => {
    let formComponent,
      hint =
        "HINT: Make sure you have a button with text: 'Submit' and type: 'submit' in your form.",
      actualMsg =
        "FriendForm.jsx's form does not have a 'Submit' button or the button doesn't have a type: 'submit' property.",
      buttons,
      button,
      expectedMsg =
        "FriendForm.jsx's form has a 'Submit' button that is a 'submit' type.";

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      buttons = formComponent.root.findAllByType("button");

      buttons.forEach((b) => {
        if (b.props.type === "submit" || b.props.children === "Submit") {
          button = b;
        }
      });

      if (!button) {
        actualMsg = "FriendForm.jsx's form does not have a submit button";
        hint =
          "HINT: Make sure you have a button with text: 'Submit' and type: 'submit' in your form. \n" +
          "Also remember to only have ONE button in your form. NOT TWO.";
      } else if (buttons.length > 1) {
        actualMsg = "FriendForm.jsx's form has more than one submit button";
        hint =
          "HINT: Make sure you only have ONE button with type: 'submit' that handles BOTH POST and PUT requests. ";
      } else {
        if (button && button.props.type !== "submit") {
          actualMsg = `FriendForm.jsx's form has a submit button but that button is of type: '${button.props.type}'.`;
          hint =
            "HINT: Make sure you have a 'Submit' button with a type of 'submit' in your form.";
        } else if (button && button.props.children !== "Submit") {
          actualMsg = `FriendForm.jsx's form has a submit button but that button has text: '${button.props.children}'.`;
          hint =
            "HINT: Make sure the type of the button is 'submit' and not 'Submit'.";
        } else {
          actualMsg = expectedMsg;
        }
      }
    } catch (error) {}

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - The 'Submit' button has an onClick attribute assigned a value.`, async () => {
    let formComponent,
      actualMsg,
      hint,
      buttons,
      onClick,
      expectedMsg =
        "The 'Submit' button has an onClick attribute assigned a value.";

    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });
      try {
        buttons = formComponent.root.findAllByType("button");
      } catch (error) {
        actualMsg =
          "Submit button coudn't be found. or it doesn't have the right property";
        hint = "HINT: Check if you didn't commented out the button.";
      }

      buttons.forEach((b) => {
        if (b.props.children === "Submit") {
          onClick = b.props.onClick;
        }
      });

      if (!onClick) {
        actualMsg =
          "The 'Submit' button does not have an onClick attribute assigned a value.";
        hint =
          "HINT: Make sure you have an onClick attribute assigned a value on your 'Submit' button.";
      } else {
        actualMsg = expectedMsg;
      }
    } catch (error) {
      actualMsg =
        "The 'Submit' button was not found or it doesn't have an onClick attribute.";
      hint =
        "HINT: Make sure you have an onClick attribute assigned a value on your 'Submit' button.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  }: You have the correct request with a payload that contains an object with the following properties: "title", "bio", "summary", "headline", "slug", "statusId", "primaryImage",`, async () => {
    let actualMsg;
    let expectedMsg = "Expected to have the correct payload";
    let hint = "";
    let submit;
    let axiosSpy = jest.spyOn(friendsService, "addFriend");
    let requestErrors = "";
    let axiosReqInterceptor = axios.interceptors.request.use(
      (request) => {
        const crossdomain = request?.crossdomain;
        const method = request?.method;
        const data = request?.data;
        const withCredentials = request?.withCredentials;
        const headers = request?.headers["Content-Type"];

        if (crossdomain !== true) {
          requestErrors += "\n 'crossdomain' is not set to true";
        }
        if (method !== "post") {
          requestErrors += "\n 'method' is not set to 'post'";
        }
        if (withCredentials !== true) {
          requestErrors += "\n 'withCredentials' is not set to 'true'";
        }
        if (headers !== "application/json") {
          requestErrors +=
            "\n 'headers' is not set to { 'Content-Type': 'application/json' }";
        }

        if (!data) {
          requestErrors +=
            "\n your data attribute is not present in your request, or is not being set correctly to the payload being passed from your FriendForm component";
        } else {
          for (let index = 0; index < minAddProps.length; index++) {
            const element = minAddProps[index];

            if (!data.hasOwnProperty(element)) {
              requestErrors += `\n '${element}' is not present in your data object `;
            }
          }
        }

        if (requestErrors) {
          actualMsg = requestErrors;
        }
      },

      (error) => {
        return Promise.reject(error);
      }
    );

    await renderAct(async () => {
      let buttons;
      try {
        try {
          buttons = formComponent.root.findAllByType("button");
        } catch (error) {
          actualMsg =
            "Submit button coudn't be found. or it doesn't have the right property";
          hint = "HINT: Check if you didn't commented out the button.";
        }

        buttons.forEach((b) => {
          if (b.props.children === "Submit") {
            submit = b.props.onClick;
          }
        });
        await renderAct(async () => {
          await submit({ preventDefault: () => {} });
          return new Promise((resolve) => setTimeout(resolve, 3000));
        });
      } catch (error) {
        actualMsg =
          "Submit button coudn't be found. or it doesn't have the right property";
        hint = "HINT: Check if you didn't commented out the button.";
      }
    });
    axios.interceptors.request.eject(axiosReqInterceptor);
    if (axiosSpy.mock.calls.length === 0) {
      actualMsg = "addFriend was not called when the button was clicked.";
      hint = "HINT: did you remember to import the service?";
    }
    if (!actualMsg) {
      actualMsg = expectedMsg;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - When the 'Submit' button is clicked, it should invoke the addFriend method and store the id from response in state.`, async () => {
    let actualMsg,
      hint,
      buttons,
      submit,
      inputs,
      formState2,
      addSpy,
      expectedMsg =
        "Clicking the 'Submit' button invokes the addFriend method and onSuccess stores the id in state.";
    actualMsg = expectedMsg;
    try {
      await renderAct(() => {
        formComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );

        if (friendsService && !friendsService.default) {
          addSpy = jest.spyOn(friendsService, "addFriend");
        } else if (friendsService && friendsService.default) {
          addSpy = jest.spyOn(friendsService.default, "addFriend");
        }
      });

      inputs = formComponent.root.findAllByType("input");
      mockFriend.slug = mockFriend.slug += new Date().toISOString();

      await renderAct(async () => {
        await inputs.forEach((input) => {
          let name = input.props.name;
          let value = mockFriend[name];
          let event = { target: { name: name, value: value } };
          input.props.onChange(event);
        });
        formComponent.update(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      buttons = formComponent.root.findAllByType("button");

      buttons.forEach((b) => {
        if (b.props.type === "submit") {
          submit = b.props.onClick;
        }
      });

      await renderAct(async () => {
        await submit({ preventDefault: () => {} });
        return new Promise((resolve) => setTimeout(resolve, 3000));
      });

      if (addSpy.mock.calls.length < 1) {
        actualMsg =
          "The 'Submit' button does not invoke the 'addFriend' method when clicked.";
        hint =
          "HINT: Make sure you're invoking the 'addFriend' method when the 'Submit' button is clicked.";
      }

      await renderAct(() => {
        formComponent.update(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      formState2 = findState(formComponent);

      if (formState2.id > 0 && formState2.id !== idFromRes) {
        actualMsg =
          "The id of the record returned from the addFriend method is different from the one stored in state.";
        hint =
          "HINT: Make sure you're updating state with the id from the response of the addFriend method.";
      }

      if (formState2.id < 1) {
        actualMsg =
          "The id of the record returned from the addFriend method is not being stored in state.";
        hint =
          "HINT: Make sure you're updating state with the id from the response of the addFriend method.";
      }
    } catch (error) {
      actualMsg =
        "The new id from your friend is not being stored in your state.";
      hint =
        "HINT: You are only going to get an id on a successful axios call.";
    }

    addSpy.mockRestore();

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - When there is an id in state, clicking the submit button should invoke the updateFriend method which fires a PUT call to update that friend`, async () => {
    let actualMsg,
      hint,
      buttons,
      submit,
      inputs,
      addSpy,
      expectedMsg =
        "Clicking the 'Submit' button when an id greater than 0 is in state invokes the updateFriend method.";

    try {
      await renderAct(() => {
        if (friendsService && !friendsService.default) {
          addSpy = jest.spyOn(friendsService, "updateFriend");
        } else if (friendsService && friendsService.default) {
          addSpy = jest.spyOn(friendsService.default, "updateFriend");
        }
      });

      inputs = formComponent.root.findAllByType("input");

      await renderAct(async () => {
        await inputs.forEach((input) => {
          let name = input.props.name;
          let value = mockFriend[name];
          let event = { target: { name: name, value: value } };
          if (name !== "slug" || name !== "id") {
            input.props.onChange(event);
          }
        });
        formComponent.update(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });

      let axiosResInterceptor = axios.interceptors.response.use(
        (response) => {
          let friendURL = response.config.url.includes("friends");

          if (!friendURL) {
            actualMsg = "The URL doesn't include the word 'friends'.";
            hint = "HINT: You are not updating a 'friend'.";
          }
          return response;
        },
        (err) => {
          if (err.response.status === 404) {
            actualMsg = "The response returned 404.";
            hint = "HINT: check the id that you are passing to the request.";
          } else if (err.response.status === 400) {
            actualMsg = "The response returned 400.";
            hint = "HINT: check the parameters being pass to your request.";
          } else {
            actualMsg = "The update was not successful.";
            hint = "HINT: Are you passing the right parameters?.";
          }

          return Promise.reject(err);
        }
      );

      buttons = formComponent.root.findAllByType("button");

      buttons.forEach((b) => {
        if (b.props.type === "submit") {
          submit = b.props.onClick;
        }
      });

      await renderAct(async () => {
        await submit({ preventDefault: () => {} });
        return new Promise((resolve) => setTimeout(resolve, 3000));
      });

      axios.interceptors.response.eject(axiosResInterceptor);

      if (addSpy.mock.calls.length < 1) {
        actualMsg =
          "The 'Submit' button does not invoke the 'updateFriend' method when there is an id in state and the button is clicked.";
        hint =
          "HINT: Make sure you're invoking the 'updateFriend' method when the 'Submit' button is clicked with an id greater than 0 in state.\n" +
          "Also make sure that you are passing the id from state to the updateFriend function appropriately.";
      } else if (!actualMsg) {
        actualMsg = expectedMsg;
      }
    } catch (error) {
      actualMsg =
        "The 'Submit' button does not invoke the 'updateFriend' method when there is an id in state and the button is clicked.";
      hint = "HINT: You need to have one button with the type of 'submit'.";
    }

    addSpy.mockRestore();

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - toastr.success should be invoked when successfully adding a friend`, async () => {
    let expectedMsg =
      "toastr.success should be invoked when successfully adding a friend";
    let hint, actualMsg;
    let appComponent;
    let submitButton;
    let buttonNotFound;
    try {
      const spytoastr = jest.spyOn(toastr, "success");

      await renderAct(() => {
        appComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });
      jest.spyOn(friendsService, "addFriend").mockResolvedValue({});

      try {
        submitButton = appComponent.root.findByProps({
          type: "submit",
        });
      } catch (error) {
        buttonNotFound = true;
      }

      const mockResponse = { success: true, data: { item: 2 } };
      friendsService.addFriend.mockResolvedValueOnce(mockResponse);
      await renderAct(async () => {
        await submitButton.props.onClick({ preventDefault: jest.fn() });
      });
      actualMsg = expectedMsg;
      expect(spytoastr).toHaveBeenCalled();
    } catch (e) {
      actualMsg = "toastr.success was not invoked when adding a friend.";
      hint =
        "HINT: make sure your toastr.success fires before you update your state";
    }
    if (buttonNotFound) {
      actualMsg = "The button could not be found.";
      hint = "HINT: make sure your button is of type 'submit'";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - toastr.error should be invoked when a friend was not added`, async () => {
    let expectedMsg =
      "toastr.error should be invoked when a friend was not added";
    let hint, actualMsg;
    let appComponent;
    let submitButton;
    let buttonNotFound;

    try {
      const spytoastr = jest.spyOn(toastr, "error");

      await renderAct(() => {
        appComponent = create(
          <MemoryRouter>
            <FriendForm />
          </MemoryRouter>
        );
      });
      jest.spyOn(friendsService, "addFriend").mockRejectedValue({});

      try {
        submitButton = appComponent.root.findByProps({
          type: "submit",
        });
      } catch (error) {
        buttonNotFound = true;
      }

      const mockResponse = { success: true };
      friendsService.addFriend.mockRejectedValueOnce({ mockResponse });
      await renderAct(async () => {
        await submitButton.props.onClick({ preventDefault: jest.fn() });
      });
      actualMsg = expectedMsg;
      expect(spytoastr).toHaveBeenCalled();
    } catch (e) {
      actualMsg =
        "toastr.error was not invoked when clicking on the submit button and the add fails.";
      hint =
        "HINT: if the add was successful, but there is a problem in the .then(), it will go to the .catch(), keep this in mind.";
    }

    if (buttonNotFound) {
      actualMsg = "The button could not be found.";
      hint = "HINT: make sure your button is of type 'submit'";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
