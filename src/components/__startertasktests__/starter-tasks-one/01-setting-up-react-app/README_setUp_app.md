# Tests for Stubbing out App-level State

## Test `aTestingFiles.test.js`

The purpose of this test is to stub out the App-level state and verify that the expected props are passed to the `SiteNav` and `Home` components.

**Notes:**

- The test code uses React, along with the `react-router-dom`, `react-test-renderer`, and `sabioExpect` libraries.
- The `expectedState` variable represents the expected state of the App component.
- The `expectedProps` variable represents the expected props passed from the App component to the `SiteNav` and `Home` components.
- The test suite includes tests for rendering the App component, checking the App state, and verifying the props passed to the `SiteNav` and `Home` components.
- The `beforeAll` function sets up the necessary environment and creates the App component instance using `react-test-renderer`.
- The `afterAll` function unmounts the App component after all tests have finished.
- The `expect` statements use custom assertions from `sabioExpect` to perform the desired assertions on test outcomes.
- Error messages and hints are provided for troubleshooting.

---

## Tests for Stubbing out App-level State

### Setup for testing

```javascript
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { create, act as renderAct } from 'react-test-renderer';
import '../sabioExpect';
import App from '../../../App';
import Home from '../../Home';
import SiteNav from '../../SiteNav';

let expectedState = {
	firstName: 'Unknown',
	lastName: 'User',
	isLoggedIn: false,
};
let expectedProps = {
	firstName: 'Sabio',
	lastName: 'WeCode',
	isLoggedIn: true,
};
```
