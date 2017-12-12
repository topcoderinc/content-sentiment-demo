# Memorial Profanity Filter and Sentiment  Analysis

## REST API

REST API endpoints details. Main endpoints:

* /analyze?text=\<text\>

## Requirements

* Tested with Node 8.4.0

## Configurations

The server should be able to run with the default configurations.

### Environment Variables

Modify the environment variables, or create a `.env` file in the root folder ([details](https://github.com/motdotla/dotenv)).

`PORT` (default: 3000) The port to run the API endpoint server.

### General Configurations

The `src/config.js` file has general configurations. In most cases the configurations can be altered with environment variables.

## Installation and Scripts

Install [Node.js](https://nodejs.org/en/download/current/), and optionally install [yarn](https://yarnpkg.com/).

To install dependencies run `yarn` or `npm install`.

### Scripts

For all scripts you can replace `yarn` by `npm` if you do not have yarn installed.

* `yarn start` starts the server.
* `yarn run dev` automatically reloads the server when developing.
* `yarn run build` compiles pre-ES6 JavaScript to the `build` folder to use with a regular node environment.

## Project Overview

Run the server then go to http://127.0.0.0:3000 (or configured port). This will show a demo HTML page where you will be able to input text to be analyzed.