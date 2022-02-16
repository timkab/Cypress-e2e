# Passport e2e web testing 
with Cypress and Cucumber

# :hammer_and_wrench: WorkInProgress :hammer_and_wrench:

[Buld status] is coming
http://<jenkinsroot>/path/to/job/badge/icon?... (for jobs)
http://<jenkinsroot>/path/to/job/<buildNumber>/badge/icon?... (for builds)

## Prerequisites
- node v12 or up `$ node -v`
- npm installed `$ npm -v`

## Setup
- Clone repository with SSH `$ git clone git@github.com:steadyapps/passport-automation-tests.git`
- Move to directory `$ cd passport-automation-tests`
- Confirm cypress `$ npx cypress --version`

## Run scripts
- `$ npm cy:open` - "TZ=UTC cypress open"
- `$ npm cy:run` - "TZ=UTC cypress run"
- `$ npm cy:all` - "TZ=UTC cypress run --spec \"**/*.features\""
- `$ npm cy:each` - "TZ=UTC cypress run --spec \"**/*.feature\""
- `$ npm cy:run IntroPage/Landing.feature` - "./node_modules/.bin/cypress-tags run -g 'cypress/tests/introPage/Landing.feature'
