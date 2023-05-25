import "../../sabioExpect";
import fs from "fs";

jest.setTimeout(20000);

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

  filesAr.forEach(({ component, filePath }) => {
    let actualMsg, hint, actualPath, isPath;
    if (fs.existsSync(filePath)) {
      actualPath = filePath;
    }

    let expectedMsg = `${component} to exist in: ${filePath}`;
    it(`${component} should exist in the correct folder`, () => {
      try {
        isPath = actualPath.name === component;
        actualMsg = expectedMsg;
      } catch (error) {
        actualMsg = `${component} does not exist or is not in the correct path`;
        hint = `HINT: Double check path syntax. Folder path: ${filePath}`;
      }
      expect(actualMsg).sabioToBe(expectedMsg, hint);
    });
  });
});
