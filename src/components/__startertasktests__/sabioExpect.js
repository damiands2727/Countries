// Custom expects
expect.extend({
  sabioToBe(received, expected, customMessage) {
    const pass = received === expected;
    customMessage = customMessage || "";
    if (pass) {
      return {
        message: function () {
          return `The results were not expected to match.\nWe expected: ${expected}\n\nWe received: ${received}\n\n${customMessage}\n\n<stack below>\n\n\n`;
        },
        pass: true,
      };
    } else {
      return {
        message: function () {
          return `Expected result was not found.\nExpected: ${expected}\n\nWe received: ${received}\n\n${customMessage}\n\n<stack below>\n\n\n`;
        },
        pass: false,
      };
    }
  },
});
expect.extend({
  sabioToMatchObject(received, expected, extraMessage) {
    const pass = Object.keys(expected).every((key) => {
      return received.hasOwnProperty(key) && received[key] === expected[key];
    });

    if (pass) {
      return {
        message: () => `Expected ${received} not to match ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `Expected objects to have the same properties.\nReceived these properties:\n\t${JSON.stringify(
            Object.keys(received),
            0,
            1
          )}\n\nExpected these properties:\n\t${JSON.stringify(
            Object.keys(expected),
            0,
            1
          )}\n\n${extraMessage}\n\n<stack below>\n\n`,
        pass: false,
      };
    }
  },
});

expect.extend({
  sabioToBeDefined(received, customMessage) {
    const pass = received !== undefined;
    customMessage = customMessage || "";
    if (pass) {
      return {
        message: function () {
          return `The result is not defined \n\nWe received: ${received}\n\n${customMessage}\n\n<stack below>\n\n\n`;
        },
        pass: true,
      };
    } else {
      return {
        message: function () {
          return `Expected result was not found.\nWe received:${received}\n\n${customMessage}\n\n<stack below>\n\n\n`;
        },
        pass: false,
      };
    }
  },
});
