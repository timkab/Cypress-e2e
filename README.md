# Cypress e2e stg envr testing of https://passport.steadyapp.com/

[Buld status] is coming
http://<jenkinsroot>/path/to/job/badge/icon?... (for jobs)
http://<jenkinsroot>/path/to/job/<buildNumber>/badge/icon?... (for builds)

## Setup
- Clone repository
- Move to the project directory `$ cd Cypress-e2e`
- Install node (v16 or up) via installer or run `$ brew install node`
- Check npm is installed `$ npm -v`
- Install cypress `$ npm install --save-dev cypress`
- Create .env in the project root

## Run scripts
- `$ npm run cy:open` - "TZ=UTC cypress open"
- `$ npm run cy:run` - "TZ=UTC cypress run"
- `$ npm run cy:all` - "TZ=UTC cypress run --spec \"**/*.features\""
- `$ npm run cy:each` - "TZ=UTC cypress run --spec \"**/*.feature\""
- `$ npm run cy:run IntroPage/Landing.feature` - "./node_modules/.bin/cypress-tags run -g 'cypress/tests/introPage/Landing.feature'
