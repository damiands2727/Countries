import axios from "axios";

export const mockUser = {
  firstName: "TestUser",
  lastName: "TestUser",
  email: "randomUser@user.com",
  password: "12ThisPassword!",
  passwordConfirm: "12ThisPassword!",
  avatarUrl: "https://www.google.com",
  tenantId: "TestUser",
};

export const mockFriend = {
  bio: "string1",
  title: "string1",
  summary: "string1",
  headline: "string1",
  statusId: "Active",
  slug: "string1",
  primaryImage: "https://sabio.la/images/logo.png",
};

export const onError = (err) => {
  console.log(JSON.stringify(err.response.data.errors));
};

export const addFriend = (friend) => {
  const config = {
    method: "POST",
    url: "https://api.remotebootcamp.dev/api/friends",
    data: friend,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(() => {})
    .catch(onError);
};

export const testAddFriends = () => {
  let friends = [];
  for (let i = 0; i < 5; i++) {
    let friend = { ...mockFriend };
    friend.bio = friend.bio + Math.floor(Math.random() * 100);
    friend.title = friend.title + Math.floor(Math.random() * 10);
    friend.summary = friend.summary + Math.floor(Math.random() * 10);
    friend.headline = friend.headline + Math.floor(Math.random() * 10);
    friend.slug = friend.slug + new Date().toISOString() + i;
    friends.push(friend);
  }
  return friends;
};

export const getMemoStates = (memoState, prevState = []) => {
  if(!!memoState?.memoizedState){
    prevState.push(memoState.memoizedState);
  }
  if(!memoState?.next) {
    return prevState;
  }
  return getMemoStates(memoState.next, prevState);
};

export const elementByType = (type) => (element) =>
  element.type === type || // Match non-memo'd
  element.type === type.type; // Match memo'd

export const filterCards = (div) =>
  div?.props?.className?.match(/\bcard\b/i) &&
  !div?.props?.className?.match(/\bcard-\b/i);

export let numb = 1;
// this global function runs basic tests for a service file.
// It checks for valid exports from the file path you provide and looks for the specific function names you provide(expMethods).
// Any further testing of the service file will need to be written in your test file.
// pass a path to the service file, expected name of service file, and array of expected methods
export const serviceFileTests = async (
  pathToService,
  serviceName,
  expMethods
) => {
  let exportType;
  let hint = "";
  let testNum;
  let svc = require(pathToService);

  if (numb.toString().length === 1) {
    testNum = `0${numb}`;
  } else {
    testNum = numb;
  }

  it(`${testNum} - ${serviceName}.js should export`, () => {
    let actualMsg,
      expectedMsg = `${serviceName}.js file exports as expected.`;
    actualMsg = expectedMsg;

    if (Object.keys(svc).length > 0) {
      if (svc.default) {
        exportType = "default";
      } else if (svc.svc) {
        exportType = "namedObject";
      } else {
        exportType = "namedFunctions";
      }
    } else {
      actualMsg = `The ${serviceName}.js file is not exporting anything`;
      hint = `HINT: Make sure you are exporting the ${serviceName} object or methods.`;
    }

    expect(actualMsg).sabioToBe(expectedMsg, hint);
  });
  numb++;
  expMethods.forEach((method) => {
    let localNum = 0;

    if (numb.toString().length === 1) {
      localNum = `0${numb}`;
    } else {
      localNum = numb;
    }

    it(`${localNum} - The ${serviceName}.js file should have a ${method} method`, () => {
      hint = "";
      if (exportType === "default") {
        if (!svc.default[method]) {
          hint = `HINT: Make sure you are exporting the '${method}' method.`;
        }
      } else if (exportType === "namedObject") {
        if (!svc.svc[method]) {
          hint = `HINT: Make sure you are exporting the '${method}' method.`;
        }
      } else if (exportType === "namedFunctions") {
        if (!svc[method]) {
          hint = `HINT: Make sure you are exporting the '${method}' method.`;
        }
      } else {
        hint = `HINT: Make sure you are exporting the ${serviceName} object or methods.`;
      }

      let actualMsg,
        expectedMsg = `The ${serviceName}.js file should have the ${method} method`;
      actualMsg = expectedMsg;
      if (hint) {
        actualMsg = `The ${serviceName}.js file is not exporting the ${method} method`;
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
    numb++;
  });
};

export const isStrInElementCI = (ele, strValue) => {
  //ele: ReactTestInstance
  //strValue: string to find in the element
  //this function checks all the elements inside a ReactTestInstance and find a string value. Not case sensitive
  if (!ele || !ele.children || ele.children.length === 0) {
    return false;
  }
  let regEx = new RegExp(strValue, "i");
  const hasMatchingChild = (child) => {
    return typeof child === "string" && child.match(regEx);
  };

  return ele.children.some((child) => {
    return hasMatchingChild(child) || isStrInElementCI(child, strValue);
  });
};

export const isStringInElement = (ele, strValue, isImgUrl) => {
  //ele: ReactTestInstance
  //strValue: string to find in the element
  //isImgUrl: bool to check if the strValue exists in the 'img' elements
  //function to check all the elements inside a ReactTestInstance and find the exact string value.
  if (!ele || !ele.children || ele.children.length === 0) {
    return false;
  }

  const hasMatchingChild = (child) => {
    if (isImgUrl) {
      return child?.type === "img" && child?.props?.src?.includes(strValue);
    } else {
      if (typeof child === "string") {
        strValue.replace(/ /g, "");
        child.replace(/ /g, "");
        return child === strValue;
      } else {
        return false;
      }
    }
  };

  return ele.children.some((child) => {
    return (
      hasMatchingChild(child) || isStringInElement(child, strValue, isImgUrl)
    );
  });
};

export const getStatePropVal = (memoState, statePropName) => {
  //memoState: memoizedState property of your ReactTestInstance
  //StatePropName: Name of the state prop you're looking for
  //this function grabs the value of the state property you're looking for inside ReactTestInstance
  const { memoizedState: state, baseQueue: queue } = memoState || {};

  if (!state) {
    return null;
  } else if (
    typeof state === "object" &&
    !Array.isArray(state) &&
    statePropName in state
  ) {
    return queue?.eagerState
      ? queue.eagerState[statePropName]
      : state[statePropName];
  } else {
    return getStatePropVal(memoState?.next, statePropName);
  }
};

export const statePropExists = (memoState, statePropName) => {
  //memoState: memoizedState property of your ReactTestInstance
  //StatePropName: Name of the state prop you're looking for
  //this function checks if the state property name exists in the ReactTestInstance
  const { memoizedState: state } = memoState || {};

  if (!state) {
    return false;
  } else if (
    typeof state === "object" &&
    !Array.isArray(state) &&
    statePropName in state
  ) {
    return true;
  } else {
    return statePropExists(memoState?.next, statePropName);
  }
};

export const deepEqual = (obj1, obj2) => {
  //this function makes a deep comparison of two objects
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }

  if (obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
