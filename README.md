Bet365 Technical Test
---

## Instructions

The src files for the project (typescript, CSS and HTML files) are all located under `./src`. 


## Install dependencies via NPM

The project uses Webpack to compile the Typescript files. Install the dependencies in order to view in browser by running an npm install from the root directory:

`$ npm i`

Once installed, run:

`$ npm start`

The project should then be available on `http://localhost:9000/` by default.


## Build your app without minification

In order to build the production files (with typescript transpiled but unminified) to the /dist directory, run:

`$ npm run build`

Or to minify the typescript:

`$ npm run build.prod`


## Unit tests

I have included a couple of example unit tests (in `./src/scripts/ticker.specs.ts`), these can be run as follows:

`$ npm run test`