# Realtime game app - Frontend

[![Build Status](https://travis-ci.org/emsa16/realtimegame-frontend.svg?branch=master)](https://travis-ci.org/emsa16/realtimegame-frontend)
[![CircleCI](https://circleci.com/gh/emsa16/realtimegame-frontend.svg?style=svg)](https://circleci.com/gh/emsa16/realtimegame-frontend)
[![Maintainability](https://api.codeclimate.com/v1/badges/d9f4c10ebbcae843bd92/maintainability)](https://codeclimate.com/github/emsa16/realtimegame-frontend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d9f4c10ebbcae843bd92/test_coverage)](https://codeclimate.com/github/emsa16/realtimegame-frontend/test_coverage)
[![BCH compliance](https://bettercodehub.com/edge/badge/emsa16/realtimegame-frontend?branch=master)](https://bettercodehub.com/results/emsa16/realtimegame-frontend)

This repo is the frontend half of a realtime game prototype. The backend can be found [here](https://github.com/emsa16/realtimegame-backend).

This project uses React and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Create React App includes the Jest test runner. Additional testing utilities are Enzyme, which helps with rendering and analyzing React components, and Mock Socket, which creats a mock Websocket server to help test the chat frontend part. There are Dockerfiles available to test the project in development mode in different versions of Node.


## Requirements
- Node
- yarn
- backend API running on the address pointed to in `src/api.js`


## Installation
    $ git clone https://github.com/emsa16/realtimegame-frontend.git
    $ cd realtimegame-frontend
    $ yarn install


## Test
    $ yarn test

See below also commands for running tests in Docker.


## Usage
    $ yarn start    # Runs the app in development mode. View at http://localhost:3000
    $ yarn build    # Builds the app for production to the `build` folder
    $ yarn deploy   # Builds the app for production and transfers files to production server (requires SSH authentication)

It is also possible to run React in development mode on other ports than the standard port 3000. To use another port, the environment variable `PORT=XXXX` needs to be added before `yarn start`


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


BTH 2019
