import "../../sabioExpect";

describe("Component File Validation", () => {
  const fs = require("fs");
  it("Friends Component should exist in the correct folder.", async () => {
    let msg;
    let hint;

    let fc = fs.existsSync("src/components/friends/Friends.jsx");

    if (!fc) {
      msg =
        "Friends.jsx does not exist, is not in the correct location, or it is spelled incorrectly.";
      hint =
        " HINT: Make sure you have your friends list component defined and named Friends.jsx" +
        " and it is inside the '/components/friends' folder ";
    } else if (fc) {
      msg = "Friends.jsx to exist in: 'src/friends'";
      hint = msg;
    }

    await expect(msg).sabioToBe("Friends.jsx to exist in: 'src/friends'", hint);
  });

  it("usersService.js should exist in the correct folder.", async () => {
    let svc = fs.existsSync("src/services/usersService.js");
    let msg;
    let hint;
    if (!svc) {
      msg =
        "usersService.js does not exist, is not in the correct location, or it is spelled incorrectly.";
      hint =
        " HINT: double check path syntax. Folder path should be: '/src/services/usersService.js'.";
    } else if (svc) {
      msg = "usersService.js to exist in: '/src/services'";
      hint = msg;
    }

    await expect(msg).sabioToBe(
      "usersService.js to exist in: '/src/services'",
      hint
    );
  });
});
