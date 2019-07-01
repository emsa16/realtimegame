# Realtime browser game app - Frontend

[![Build Status](https://travis-ci.org/emsa16/realtimegame-frontend.svg?branch=master)](https://travis-ci.org/emsa16/realtimegame-frontend)
[![CircleCI](https://circleci.com/gh/emsa16/realtimegame-frontend.svg?style=svg)](https://circleci.com/gh/emsa16/realtimegame-frontend)
[![Maintainability](https://api.codeclimate.com/v1/badges/d9f4c10ebbcae843bd92/maintainability)](https://codeclimate.com/github/emsa16/realtimegame-frontend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d9f4c10ebbcae843bd92/test_coverage)](https://codeclimate.com/github/emsa16/realtimegame-frontend/test_coverage)
[![BCH compliance](https://bettercodehub.com/edge/badge/emsa16/realtimegame-frontend?branch=master)](https://bettercodehub.com/results/emsa16/realtimegame-frontend)

This is the frontend half of the project. The backend half can be found [here](https://github.com/emsa16/realtimegame-backend). This project is a part of the course [ramverk2](https://dbwebb.se/kurser/ramverk2-v1/) at Blekinge Institute of Technology.



## Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Tests](#tests)
5. [Running in Docker](#running-in-docker)
6. [CI](#ci)
7. [Realtime](#realtime)



## Introduction
This repository is the frontend half of a realtime browser game prototype. "Realtime" in this case means that the project is able to manage multiple concurrent users, sending data between each other in realtime. "Game" refers to that the prototype contains game-like aspects, like player avatar creation and users being able to control their avatar in a game world, like an old-school role-playing game.

It could be argued that this project is not much of a game per se, however the purpose is to showcase interesting techniques that could be used for these kinds of projects in a browser environment.

The frontend of this project consists of a website containing a graphical browser game, a chat client, and a player creation interface. It communicates with the backend part of this project to update the player character, game world and keep the chat realtime. The project uses the [React](https://reactjs.org/) framework but can be built into a collection of static files that can be stored on a simple web server.

#### Requirements specification
This is a list of features that were specified before development began (this includes requirements for both frontend and backend):

1. The user can register an account on the website
2. The user needs to login to access the game
3. The user can create an avatar and choose their in-game name and appearance
4. There are 5 different appearances to choose from
5. The user can modify their avatar at any point, and if the user is currently in the game world, these changes are instantly seen by other users
6. The user's avatar, including their in-game name, appearance and current position in the game world, is stored in a database and can be retrieved on any device when the user logs in
7. The user can enter the game to put their avatar in the game world
8. The game world is a graphical presentation with bitmap tiles
9. The user can move the avatar around in the game world, which is communicated to other users in realtime
10. The user can see other player avatars that have entered the game and see when they move around in the game world in realtime
11. All users that are in-game are sent regular updates with the positions of each other user's current position
12. The user can talk to other users by typing text into a text field and sending it to the game
13. Messages are displayed in speech bubbles in the game world in realtime
14. Messages are also displayed in a chat window in realtime
15. The user can leave the game at any point, which removes their avatar from the game world and other users cannot see it any longer. The avatar's current position is stored in a database.
16. The user can log out of the site, which also removes their avatar from the game world, but stores details about it in a database
17. The project uses the author's [chat server module](https://www.npmjs.com/package/@emsa16/chat-server)
18. The project can be run in Docker
19. The project includes unit tests which cover at least 70% of the code
20. The project includes a CI chain with build, code quality and code coverage tools

All of these requirements were implemented except for 11 and 13. Requirement 11 was found to be unnecessary and requirement 13 was considered too complex to fit inside the project schedule.

#### Technologies
The frontend consists of the following primary parts:
- [React](https://reactjs.org/): A user interface library that works as the framework for the whole frontend. The project has been bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
    - Motivation: React is currently the most popular frontend framework ([source](https://2018.stateofjs.com/front-end-frameworks/overview/)). It provides control over updating components separately, without reloading the whole page, which would seem to be a good thing when the project consists of building a realtime browser game.
- [Yarn](https://yarnpkg.com/lang/en/): An alternative package manager to NPM, and which works in a very similar way.
    - Motivation: Yarn works better with React apps and had to be used for this project, as there was a version conflict among the package dependencies that NPM could not solve. Also, its commands are a bit shorter, making it faster to work with on the command line.
- [Jest](https://jestjs.io/): A test runner that is included in the Create React App.
    - Motivation: As Jest is the default option when using Create React App and it provides code coverage as well, there was no reason to change it out.
- [Docker](https://www.docker.com/get-started): Virtualization platform that gives the ability to run and test the project in different environments
    - Motivation: Once set up, Docker containers are very easy to work with

#### Evaluation
If you have not worked with component-based libraries before, it can take some time to get used to the structures that this concept forces on the code, especially how to get components to work with each other can be a bit tedious. Still, once the foundation has been laid, React works well for the purposes of this project. Having each part of the website in a separate component helps to organize the project and separate logic and communication with the backend.

As Jest and React are both maintained by Facebook, they work very well together. Still, testing React projects can be tough, although this is probably not unique to React but is the same for similar frameworks such as Vue and Angular.

As this is only a prototype, a lot of the control is in the frontend. This means that restrictions implemented only on the frontend (e.g. restrictions on chat commands) can be bypassed, meaning that for a production-grade version of this project, more control needs to be added to the backend for security reasons.



## Installation

#### Requirements
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/)
- backend API and WebSocket server running on the addresses pointed to in `src/api.js`

#### Commands
    $ git clone https://github.com/emsa16/realtimegame-frontend.git
    $ cd realtimegame-frontend
    $ yarn install



## Usage

#### Commands (after installation)
    $ yarn start    # Runs the app in development mode. View at http://localhost:3000
    $ yarn build    # Builds the app for production to the /build folder
    $ yarn deploy   # Builds the app for production and transfers files to production server (requires SSH authentication)

    Running the app in development mode in Docker containers
    $ yarn docker-node1     # node latest, alpine version (test on http://localhost:8030 (default port))
    $ yarn docker-node2     # node 10, alpine version (test on http://localhost:8031 (default port))
    $ yarn docker-node3     # node 8, alpine version (test on http://localhost:8032 (default port))
    $ yarn docker-start     # Runs all three containers (see ports above)
    $ yarn docker-stop      # Stops all active containers
    $ yarn docker-build     # Builds images for above containers from their respective Dockerfile

#### Environment variables
The following environment variables can be set by inserting these before above commands:
- `PORT=XXXX` - set server port when running the app in development mode (default: 3000). When used with Docker containers, this sets the port that connects to the app running in the container. Default port values for the Docker containers can be seen above.



## Tests
The test suite consists of the following tools:
- [Jest](https://jestjs.io/): Runs the unit tests that are found in the project. To make the import paths as short as possible, tests in React are commonly placed in the same folder as the file they are testing. As Jest is the default option when using Create React App and it provides code coverage as well, there was no reason to change it out.
- [Enzyme](https://airbnb.io/enzyme/): Assists Jest by rendering and analyzing React components, which is good when you want test the DOM
- [Mock Socket](https://github.com/thoov/mock-socket): Assists Jest by giving the tools to mock a WebSocket server, which helps to test the chat client
- [stylelint](https://stylelint.io/): lints CSS files
- [eslint](https://eslint.org/): lints JavaScript files

#### Commands (after installation)
    $ yarn test             # Runs the complete test suite
    $ yarn stylelint        # Runs CSS linter only
    $ yarn eslint           # Runs JavaScript linter only

    Running tests in Docker containers
    $ yarn test-node1       # Runs yarn test inside node1 container
    $ yarn test-node2       # Runs yarn test inside node2 container
    $ yarn test-node3       # Runs yarn test inside node3 container

#### Code coverage
Jest includes code coverage, which is printed to the console at the end of every test run. A more extensive and visual code coverage report can be viewed in the browser by opening `coverage/lcov-report/index.html` (which can be found after tests are run).

The tests cover 96% of the project. It was quite challenging to get there, primarily how to work around the WebSocket object that is used in the frontend. Using the Mock Socket module helped a lot, but some rewriting of the frontend was also needed for the tests to work, but this also helped improve the code structure. Another revelation that helped towards getting the high coverage was that component methods can be called in tests just like any class method, if the `.instance()` method is used ([read more](https://airbnb.io/enzyme/docs/api/ReactWrapper/instance.html)).

There are only 12 statements in the whole project that remain untested. `index.js` is completely untested, but it only consists of five lines and contains no conditional logic or return values to test. There are also a couple of error conditions during fetch requests that are hard to replicate and a few other one-liners that are difficult to reach during tests.

#### Evaluation
In order to be able to properly test a React application, Enzyme is an invaluable addition to Jest. With it, tests become much more powerful and flexible. Enzyme and Mock Socket sometimes lack in detailed documentation, which leads to trial and error to get tests to work. Still, Jest and Enzyme work well with React applications and this project contains mostly pretty standard React constructs.



## Running in Docker
    $ yarn docker-node1     # node latest-alpine (test on http://localhost:8030)
    $ yarn docker-node2     # node 10-alpine (test on http://localhost:8031)
    $ yarn docker-node3     # node 8-alpine (test on http://localhost:8032)

    $ yarn docker-start     # Runs all containers (see ports above)
    $ yarn docker-stop      # Stops all active containers
    $ yarn docker-build     # Builds above images from their respective Dockerfile

    $ yarn test-node1       # Runs yarn test inside node1 container
    $ yarn test-node2       # Runs yarn test inside node2 container
    $ yarn test-node3       # Runs yarn test inside node3 container



## CI
The CI chain consists of the following tools, which all have their badges included at the top of this document:
- [Travis](https://travis-ci.org/emsa16/realtimegame-frontend): Build tool, provides Code Climate with code coverage report
- [CircleCI](https://circleci.com/gh/emsa16/realtimegame-frontend): Build tool
- [Code Climate](https://codeclimate.com/github/emsa16/realtimegame-frontend): Code quality analysis and code coverage (two separate badges)
- [Better Code Hub](https://bettercodehub.com/results/emsa16/realtimegame-frontend): Code quality analysis

The reason for having two build tools and two code quality tools is for redundancy. The tools all work a bit differently from each other, and an issue might go past one of the tools but is then picked by another. All of the tools provide a nice user interface which is why these tools are chosen instead of other alternatives.

#### Limitations
There are some limitations to keep in mind, which are not exclusive to above tools. The build tools install the project and run the `yarn test` command, but they never actually run the project, meaning that issues that are not visible to unit tests might go unnoticed, e.g. layout issues. The code quality tools can only perform static code analysis, meaning that they might grade parts of the code unfairly, or miss less obvious issues.

#### Evaluation
At times, builds fail because of some issue that needs to be fixed. Other times, the issue only exists in the build tool environment but nowhere else and adjustments have to be made only to satisfy the build tool, which is unfortunate. One issue in particular that could not be completely resolved was that the `react-scripts` package could not be updated to version 3 to solve some dependency vulnerabilities, because the build tools crashed when the project used the newer version and this module had to be downgraded.

When all is going well however, these tools are not really noticed, meaning that they give some assurance that the project is working, without needing much attention from the developer. However, the risk is, especially with the code quality tools, that you become blind to the grade inside the badge and don't really think to try and fix some of the issues discovered by the tool.

Apart from needing a little bit extra setup to send the code coverage report from Travis to Code Climate, these tools work well in this project.

Code Climate rates this project a D. There are two categories of issues identified: overly long and sometimes too complex methods, and small blocks of repetitive code that might be quite hard to refactor. In this case the grade seems fair and code complexity could probably be reduced by splitting methods into smaller separate ones. Better Code Hub rates this project a 7/10. It has quite rigid requirements regarding code length, and it also mentions repeating code. Still, the grade is ok and in summary, these code quality analyses seem fair.



## Realtime
The realtime aspect of this browser game prototype lies mostly on the backend and is described in more detail [here](https://github.com/emsa16/realtimegame-backend). The part of it that is visible on the frontend is the chat client and the game world. The `src/Chat` component connects to the chat server with the use of the standard WebSocket API. The same component also renders the chat client with its message log and connection controls. Messages are sent through the chat client in realtime. The `src/Game` component renders the game world and the player avatar inside it. When the player moves inside the world, the movement action is sent to the chat component which sends it to the chat server. In this way, the movement is immediately shown for other players that are in the game world, making the game world realtime as well. Finally, changing the avatar's appearance and name is also immediately reflected in other users' browsers, with the help of the socket connections.

There was never any need to use a WebSocket library on the frontend, as the plain WebSocket object was easy to work with and the client did not need to do complex things.

#### Evaluation
In order to save time, it was decided to use the same chat connection for the game world and avatar updates as well. It might be argued that this makes both the chat server and the client too complex and that different aspects should be separated into separate services. As a prototype however, this shows that realtime games in the browsers are feasible, at least when timing does not come down to milliseconds. Also, the end user does not notice any difference no matter how the communication is organized.



BTH 2019
