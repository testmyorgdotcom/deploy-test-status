deploy-test-status
==================

SFDX Plugin to provide CI compatible test status report for sfdx projects deploys

[![Version](https://img.shields.io/npm/v/deploy-test-status.svg)](https://npmjs.org/package/deploy-test-status)
[![CircleCI](https://circleci.com/gh/testmyorg/deploy-test-status/tree/master.svg?style=shield)](https://circleci.com/gh/testmyorg/deploy-test-status/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/testmyorg/deploy-test-status?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/deploy-test-status/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/testmyorg/deploy-test-status.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/testmyorg/deploy-test-status/badge.svg)](https://snyk.io/test/github/testmyorg/deploy-test-status)
[![Downloads/week](https://img.shields.io/npm/dw/deploy-test-status.svg)](https://npmjs.org/package/deploy-test-status)
[![License](https://img.shields.io/npm/l/deploy-test-status.svg)](https://github.com/testmyorg/deploy-test-status/blob/master/package.json)

<!-- toc -->

<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g deploy-test-status
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
deploy-test-status/0.0.3 linux-x64 node-v14.18.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx tmo:deploy:test:status [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-tmodeployteststatus--i-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx tmo:deploy:test:status [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

gets deploy test status report in CI-ready format

```
USAGE
  $ sfdx tmo:deploy:test:status [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --jobid=jobid                                                                 job id of the deployment you want to
                                                                                    check test status for

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx tmo:deploy:test:status --targetusername myOrg@example.com --jobid 0Af0900000O0xyABCD
```

_See code: [src/commands/tmo/deploy/test/status.ts](https://github.com/testmyorg/deploy-test-status/blob/v0.0.3/src/commands/tmo/deploy/test/status.ts)_
<!-- commandsstop -->
