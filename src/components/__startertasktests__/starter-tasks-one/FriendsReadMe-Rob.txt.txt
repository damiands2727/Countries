For Storing Components in State Section of Friends.jsx
1. Must have a working login function in usersService.js and it must be usersService.login. Also, usersService.js must live in src > services directory
2. Must not use peopleComponents or arrayOfPeople.
3. Must use arrayOfFriends and friendsComponents.
For Conditional rendering section of Friends.jsx
1. Must have a working login function in usersService.js and it must be usersService.login. Also, usersService.js must live in src > services directory
2. Must have an id on Show Friends button that has value: "show-friends".


## OUTDATED
## you can use the following script in package.json to test these changes:
FriendComponentState:
"test-friends-state": "react-scripts test -i /src/components/__startertasktests__/starter-tasks-one/friends-comp-state/* --env=jsdom --testResultsProcessor=./node_modules/jest-html-reporter"

FriendConditionalRendering:
"test-conditional-rendering": "react-scripts test -i /src/components/__startertasktests__/starter-tasks-one/friends-conditional/* --env=jsdom --testResultsProcessor=./node_modules/jest-html-reporter"


These tests only use the included Friends.jsx and the friendsService.js and the usersSevice.js