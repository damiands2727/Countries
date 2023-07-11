import "../../sabioExpect";

describe("Component File Validation:", () => {
  const fs = require("fs");
  const filesAr = [
    {
      component: "Friends.jsx",
      filePath: "src/components/friends/Friends.jsx",
    },
    {
      component: "Friend.jsx",
      filePath: "src/components/friends/Friend.jsx",
    },
    {
      component: "FriendForm.jsx",
      filePath: "src/components/friends/FriendForm.jsx",
    },
    {
      component: "friendsService.js",
      filePath: "src/services/friendsService.js",
    },
    {
      component: "usersService.js",
      filePath: "src/services/usersService.js",
    },
  ];

  filesAr.forEach(({ component, filePath }, i) => {
    it(`0${i + 1}: ${component} should exist in the correct folder.`, () => {
      let actualMsg, hint;
      let expectedMsg = `${component} to exist in: ${filePath}.`;
      if (fs.existsSync(filePath)) {
        actualMsg = expectedMsg;
      } else {
        actualMsg = `${component} does not exist, is not in the correct location, or it is spelled incorrectly.`;
        hint = `HINT: double check path syntax. Folder path should be: ${filePath}.`;
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
  });
});
