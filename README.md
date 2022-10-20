# Cypress BDD with Cucumber automation project
## API and FE tests

## Test coverage: 
- Auth0 Registration and Login
- Linking user's Financial instituion (via Plaid) and getting employement data (via Argyle)
- Post linking/processing fetching and validating data

## Setup
- Clone repository
- Move to the project directory `$ cd Cypress-e2e`
- Install node (v16 or up) via installer or run `$ brew install node`
- Check npm is installed `$ npm -v`
- Install cypress `$ npm install --save-dev cypress`
- Create .env in the project root and add environment values

## Run scripts
- `$ npm run cy:open` - "TZ=UTC cypress open"
- `$ npm run cy:run` - "TZ=UTC cypress run"
- `$ npm run cy:all` - "TZ=UTC cypress run --spec \"**/*.features\""
- `$ npm run cy:each` - "TZ=UTC cypress run --spec \"**/*.feature\""
- `$ npm run cy:run IntroPage/Landing.feature` - "./node_modules/.bin/cypress-tags run -g 'cypress/tests/introPage/Landing.feature'
