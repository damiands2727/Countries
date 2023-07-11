import React from "react";
import { MemoryRouter } from "react-router-dom";
import "../../sabioExpect";
import renderer, { act as renderAct } from "react-test-renderer";
import Login from "../../../user/Login";
import App from "../../../../App";
import * as starterHelper from "../../starterHelper";
import axios from "axios";
import * as usersService from "../../../../services/usersService";
import toastr from "toastr";
import https from "https";

jest.setTimeout(50000);

let number;

const loginProperties = {
  email: "text",
  password: "password",
};

jest.setTimeout(50000);

var loginErrors = "";

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.httpAgent = new https.Agent({ keepAlive: true });
  if (config.url.includes("login")) {
    const crossdomain = config?.crossdomain; //true
    const method = config?.method; //"post"
    const data = config?.data; // {email: "", password: "", tenantId: ""}
    const headers = config?.headers["Content-Type"]; //"application/json"
    config.data = { ...config.data, tenantId: "TestUser" };

    let requestErrors = "";

    if (crossdomain !== true) {
      requestErrors += "\n 'crossdomain' is not set to true";
    }
    if (method !== "post") {
      requestErrors += "\n 'method' is not set to 'post'";
    }
    if (headers !== "application/json") {
      requestErrors +=
        "\n 'headers' is not set to { 'Content-Type': 'application/json' }";
    }

    let checkingData = Object.keys(data).length === 0;

    if (checkingData) {
      requestErrors +=
        "The Payload object that you are passing to your 'login' method is empty.";
    }

    if (!data.hasOwnProperty("email")) {
      requestErrors += "\n 'email'is not present in your payload object ";
    }
    if (!data.hasOwnProperty("password")) {
      requestErrors += "\n 'password' is not present in your payload object";
    }
    if (!data.hasOwnProperty("tenantId")) {
      requestErrors += "\n 'tenantId'is not present in your payload object";
    }

    if (requestErrors) {
      loginErrors = requestErrors;
    }
  }
  return config;
});

let usersServiceFile;

if (usersService?.default) {
  usersServiceFile = usersService?.default;
} else if (usersService?.usersService) {
  usersServiceFile = usersService?.usersService;
} else {
  usersServiceFile = usersService;
}

describe("usersService.js", () => {
  let pathToService = "../../services/usersService.js";
  let serviceName = "usersService";
  let expMethods = ["login"];

  starterHelper.serviceFileTests(pathToService, serviceName, expMethods);

  number = starterHelper.numb;
});

describe("Login component", () => {
  it(`${
    number < 10 ? `0${number}` : number
  } - The 'Login' component is a functional component and renders on the DOM`, async () => {
    let actualMsg,
      component,
      expectedMsg = `You are using a 'Functional' component.`;
    let hint = "";
    try {
      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter initialEntries={["/login"]}>
            <App />
          </MemoryRouter>
        );
      });

      let loginInstance = component.root.find(
        starterHelper.elementByType(Login)
      );

      let isClassComp =
        loginInstance._fiber.elementType.toString().split(" ")[0] === "class";

      if (isClassComp) {
        actualMsg = `You are using a 'Class' component and you should be using a 'Functional' component for Login.jsx.`;
      } else {
        actualMsg = expectedMsg;
      }
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Login.jsx has a route in App.jsx`, async () => {
    let componentInstance, appInstance;
    let hint = "";
    let actualMsg,
      expectedMsg = `The Login Component exists. And there is a route for it in App.jsx`;
    actualMsg = expectedMsg;

    try {
      await renderAct(async () => {
        appInstance = renderer.create(
          <MemoryRouter initialEntries={["/login"]}>
            <App />
          </MemoryRouter>
        );
      });
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }

    if (hint) {
      actualMsg = "Your App.jsx file is not rendering.";
    } else {
      try {
        componentInstance = appInstance?.root?.find(
          starterHelper.elementByType(Login)
        );
      } catch {
        hint =
          "HINT: Make sure you create a route with path: '/login' for Login.jsx in App.jsx.";
      }

      if (!componentInstance) {
        actualMsg = `The Login Component does not exist, or you don't have a route for it in App.jsx`;
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Form element is rendered`, async () => {
    let form;
    let actualMsg,
      component,
      expectedMsg = `You have a form element in your Login Component`;
    let hint = "";

    try {
      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter initialEntries={["/login"]}>
            <App />
          </MemoryRouter>
        );
      });
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }
    try {
      form = component?.root?.find(starterHelper.elementByType("form"));
      if (!!form) {
        actualMsg = expectedMsg;
      }
    } catch (err) {
      actualMsg = `You don't have a form element in your Login Component`;
      hint = `HINT: check the bootstrap docs for examples of forms`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  }  - useState hook is being implemented in Login.jsx`, async () => {
    let expectedMsg = "You are importing and implementing the 'useState' hook";
    let actualMsg, component, hint;
    let usingUseState = false;

    try {
      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter initialEntries={["/login"]}>
            <App />
          </MemoryRouter>
        );
      });
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }

    let componentInstance = component?.root?.find(
      starterHelper.elementByType(Login)
    );
    if (!!componentInstance) {
      if (!!componentInstance?._fiber?._debugHookTypes) {
        usingUseState =
          componentInstance._fiber._debugHookTypes.includes("useState");
      }
    }
    if (usingUseState) {
      actualMsg = expectedMsg;
    } else {
      actualMsg = "'useState' hook was not found in Login.jsx";
      hint = "HINT:Make sure you are importing the 'useState' hook";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Login.jsx has inputs with names that match the state properties.`, async () => {
    let inputsToFind = ["email", "password"];
    let inputElements = {};
    let actualMsg,
      component,
      expectedMsg = `The Login.jsx has inputs with names that match the state properties.`;
    let hint = "";
    try {
      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter initialEntries={["/login"]}>
            <App />
          </MemoryRouter>
        );
      });
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }

    let inputs = component?.root?.findAllByType("input");

    inputsToFind?.forEach((inputName) => {
      let correctInputs = inputs.filter(
        (input) => input?.props?.name === inputName
      );

      if (correctInputs?.length !== 1) {
        hint += `\nHINT: Make sure you have one 'input' element with the name: '${inputName}', found ${
          correctInputs ? correctInputs.length : 0
        }`;
      } else {
        inputElements[inputName] = correctInputs[0];
      }
    });

    actualMsg = expectedMsg;

    if (hint) {
      actualMsg =
        "The Login.jsx does not have inputs with names that match the state properties.";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - Login.jsx should have a state object and have properties matching Api documentation`, async () => {
    let formInstance;
    let component;
    let renderError = "";
    const expectedMsg =
      "State object to exist and have the correct properties.";
    let actualMsg = expectedMsg;
    let hint = `HINT: useState should be created as an object with the following properties:
      email: string,
      password: string
      tenantId: string`;
    const loginPropKeys = Object.keys(loginProperties);
    loginPropKeys.push("tenantId");
    let hasAllProperties = false;

    try {
      await renderer.act(() => {
        component = renderer.create(
          <MemoryRouter initialEntries={["/login"]}>
            <App />
          </MemoryRouter>
        );
      });
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }
    formInstance = component?.root?.find(starterHelper.elementByType(Login));

    try {
      hasAllProperties = loginPropKeys.every((key) => {
        const valType = loginProperties[key] === "number" ? "number" : "string";
        const val = starterHelper.getStatePropVal(
          formInstance._fiber.memoizedState,
          key
        );
        return val !== "no state found" && typeof val === valType;
      });
    } catch (error) {
      renderError = error;
    }

    if (!hasAllProperties) {
      actualMsg =
        "Login component is missing a state or some of its properties do not match a login object." +
        renderError;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  let buttonTest;

  it(`${
    number < 10 ? `0${number}` : number
  } - You have a 'Sign in' button type of 'Submit' on your component.`, async () => {
    let button;
    let hint = "";
    let actualMsg,
      component,
      expectedMsg = `You have a 'Sign in' button type of "Submit"`;

    try {
      await renderAct(() => {
        component = renderer.create(
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        );
      });
    } catch (error) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }
    try {
      button = await component?.root?.findAllByProps({ type: "submit" });
      if (button.length === 1) {
        buttonTest = button;

        actualMsg = expectedMsg;
      } else {
        actualMsg = `You do not have a 'Sign in' button  type of "Submit" or you have more than 1 button type "Submit"`;
        hint = `HINT: Is your 'Sign in' button type of "Submit" and Do you have just ONE button type of "Submit" in your Login Form?`;
      }
    } catch (e) {
      actualMsg = `You do not have a 'Sign in' button type of "Submit" or you have more than 1 button type "Submit"`;
      hint = `HINT: Is your 'Sign in' button type of "Submit" and Do you have just ONE button type of "Submit" in your Login Form?`;
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - 'Sign in' button has an onClick handler function`, async () => {
    let clickHandler = false;
    let actualMsg,
      expectedMsg = "Submit button has an onClick handler";
    let hint = "";

    if (buttonTest) {
      if (typeof buttonTest[0].props.onClick === "function") {
        clickHandler = true;
      }

      try {
        if (clickHandler) {
          actualMsg = expectedMsg;
        } else {
          actualMsg = `Submit button doesn't have an onClick handler`;
          hint = `HINT: do you have an onClick property in your 'Sign in' button?`;
        }
      } catch (e) {
        actualMsg = `Submit button doesn't have an onClick handler`;
        hint = `HINT: do you have an onClick property in your 'Sign in' button?`;
      }
    } else {
      actualMsg = `You do not have a 'Sign in' button type of "Submit" or you have more than 1 button type "Submit"`;
      hint = `HINT: Is your 'Sign in' button type of "Submit" and Do you have just ONE button type of "Submit" in your Login Form?`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;
});

describe("Login form functionality", () => {
  let appComponent;
  let renderError = "";
  let loginError;
  let formInstance;

  let mockUser = {
    email: "randomUser@user.com",
    password: "12ThisPassword!",
  };

  beforeAll(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;

    await renderer.act(() => {
      appComponent = renderer.create(
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      );
    });
    formInstance = appComponent.root.find(starterHelper.elementByType(Login));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`${
    number < 10 ? `0${number}` : number
  }: State should be updated when input changes with the same 'onChange' function`, async () => {
    const expectedMsg =
      "State property values should be updated when the corresponding input change, with the same 'onChange' function.";
    let actualMsg = expectedMsg;
    let hint = "";
    let inputs;

    inputs = formInstance?.findAllByType("input");

    if (!inputs) {
      actualMsg = "We coudn't find inputs on you component ";
      hint =
        "HINT: there should be 2 inputs on your component, one for email and one for password.";
    }

    const loginPropKeys = Object.keys(loginProperties);
    let event, input;

    let onChangeFunction;
    let onChangeSameFuncion;

    await renderer.act(async () => {
      for (const prop of loginPropKeys) {
        input = inputs?.find((i) => i.props.name === prop);
        event = {
          type: "change",
          target: {
            name: prop,
            value: mockUser[prop],
          },
        };
        if (!input) {
          actualMsg =
            "One or more inputs are missing or do not have the same name property.";
          hint =
            "HINT: Make sure you have an input for each property in your state and they have a name that matches that property.";
          break;
        }

        if (typeof input?.props?.onChange === "function") {
          input.props.onChange(event);
        }

        if (!onChangeFunction) {
          onChangeFunction = input.props.onChange?.name;
        } else {
          onChangeSameFuncion = onChangeFunction === input.props.onChange?.name;
        }
      }
    });

    if (!onChangeSameFuncion) {
      actualMsg =
        "One or more inputs do not have the same 'onFormFieldChange' function.";
      hint =
        "HINT: Make sure you have the same 'onFormFieldChange' function that set the State in your component.";
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      appComponent.update(
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      );
    } catch (e) {
      actualMsg =
        "The Login component does not exist, or is not rendering on the DOM.";
      hint =
        "HINT: Make sure your component is in the right location and is named correctly.";
    }
    for (const prop of loginPropKeys) {
      const inValue = mockUser[prop];
      const stateValue = starterHelper.getStatePropVal(
        formInstance._fiber.memoizedState,
        prop
      );
      if (stateValue !== inValue) {
        hint = "HINT: Check if all your inputs have an onChange handler";
        actualMsg =
          "One or more state properties did not update when its corresponding input changed." +
          renderError;

        break;
      }
    }
    if (loginError) {
      actualMsg = "The usersService.js file is not exporting the login method";
      hint = "HINT: Make sure you are exporting the 'login' method";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  }: When clicking on the 'Sign in' button the login method gets invoked with the proper payload and you get the right response`, async () => {
    let actualMsg;
    let expectedMsg = "Expected 'login' to have been called successfully";
    actualMsg = expectedMsg;
    let hint = "";

    try {
      let loginAxiosSpy = jest.spyOn(usersServiceFile, "login");

      let axiosResInterceptor = axios.interceptors.response.use(
        (response) => {
          if (response.status !== 200) {
            throw new Error("Response status is not 200");
          }
          return response;
        },
        (err) => {
          hint = "HINT: your call did not have a status of '200'.";
          return Promise.reject(err);
        }
      );

      await renderer.act(async () => {
        let button;
        try {
          button = formInstance?.findByProps({ type: "submit" });
          button?.props?.onClick({ preventDefault: () => {} });
        } catch (error) {
          actualMsg =
            "Submit button coudn't be found. or it doesn't have the right property";
          hint = "HINT: Check if you didn't commented out the button.";
        }
        return new Promise((resolve) => setTimeout(resolve, 2000));
      });
      axios.interceptors.response.eject(axiosResInterceptor);

      if (loginAxiosSpy.mock.calls.length === 0) {
        actualMsg = `Submit button doesn't have an onClick handler or you have more than ONE button type of "Submit"`;
        hint = `HINT: do you have just ONE button type of "Submit" and an onClick handler in your 'Sign in' button?`;
      }
    } catch (e) {
      if (e.message === "Response status is not 200") {
        actualMsg = "'login' service was called but it was not successful.";
        hint = "HINT: check your network tab to see what the response was.";
      } else {
        actualMsg =
          "The usersService.js file is not exporting the login method";
        hint = "HINT: Make sure you are exporting the 'login' method";
      }
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - You have a 'login' service method with the right config and you are passing the correct payload`, async () => {
    let actualMsg,
      expectedMsg =
        "Expected login to have been called successfully with the correct parameters.";

    let hint = "";

    try {
      jest.spyOn(usersServiceFile, "login");

      if (loginErrors) {
        actualMsg = loginErrors;
        hint = "HINT: Check the config object on your login method.";
      } else {
        actualMsg = expectedMsg;
      }
    } catch (e) {
      actualMsg = "The usersService.js file is not exporting the login method";
      hint = "HINT: Make sure you are exporting the 'login' method";
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });

  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - toastr.success should be invoked on successful login`, async () => {
    let expectedMsg =
      "Expected toastr.success to have been called when clicking on the submit button and the login is successful";
    let actualMsg, hint;

    try {
      const spytoastr = jest.spyOn(toastr, "success");

      jest.spyOn(usersServiceFile, "login").mockResolvedValue({});

      const submitButton = appComponent.root.findByProps({ type: "submit" });

      const loginResponse = { success: true };
      usersServiceFile.login.mockResolvedValueOnce({ loginResponse });
      await renderAct(async () => {
        submitButton.props.onClick({ preventDefault: jest.fn() });
      });
      actualMsg = expectedMsg;

      expect(spytoastr).toHaveBeenCalled();
    } catch (e) {
      actualMsg =
        "there was an error invoking toastr.success when clicking on the submit button and the login is successful";
      hint = "HINT: Are you invoking toastr.success on the .then handler?";
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  number++;

  it(`${
    number < 10 ? `0${number}` : number
  } - toastr.error should be invoked on a failed login`, async () => {
    let expectedMsg =
      "toastr.error to have been called when clicking the submit button and the login failed";
    let hint, actualMsg;

    try {
      const spytoastr = jest.spyOn(toastr, "error");

      jest.spyOn(usersServiceFile, "login").mockRejectedValue({});

      const submitButton = appComponent.root.findByProps({ type: "submit" });

      const loginResponse = { success: true };
      usersServiceFile.login.mockRejectedValueOnce({ loginResponse });
      await renderAct(async () => {
        submitButton.props.onClick({ preventDefault: jest.fn() });
      });
      actualMsg = expectedMsg;
      expect(spytoastr).toHaveBeenCalled();
    } catch (e) {
      actualMsg =
        "toastr.error was not invoked when clicking on the submit button and the login failed.";
      hint = `Are you invoking toastr.error on the .catch handler?`;
    }
    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
});
