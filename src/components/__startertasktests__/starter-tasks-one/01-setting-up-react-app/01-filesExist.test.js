import "../../sabioExpect";
import fs from "fs";

describe("Component File Validation:", () => {
  const filesAr = [
    { component: "App.jsx", filePath: "src/App.jsx" },
    {
      component: "Footer.jsx",
      filePath: "src/components/Footer.jsx",
    },
    {
      component: "SiteNav.jsx",
      filePath: "src/components/SiteNav.jsx",
    },
    {
      component: "Home.jsx",
      filePath: "src/components/Home.jsx",
    },
    {
      component: "TestAndAjax.jsx",
      filePath: "src/components/TestAndAjax.jsx",
    },
    {
      component: "Register.jsx",
      filePath: "src/components/user/Register.jsx",
    },
    {
      component: "Login.jsx",
      filePath: "src/components/user/Login.jsx",
    },
    {
      component: "Friends.jsx",
      filePath: "src/components/friends/Friends.jsx",
    },
    {
      component: "Jobs.jsx",
      filePath: "src/components/jobs/Jobs.jsx",
    },
    {
      component: "Companies.jsx",
      filePath: "src/components/techcompanies/Companies.jsx",
    },
    {
      component: "Events.jsx",
      filePath: "src/components/events/Events.jsx",
    },
  ];

  filesAr.forEach(({ component, filePath }, i) => {
    let testNumber, actualMsg, hint;
    if (i < 9) {
      testNumber = `0${i + 1}`;
    } else {
      testNumber = i + 1;
    }
    it(`${testNumber} - ${component} should exist in the correct folder.`, () => {
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