# Changelog

## v1.8.0 - Add db_driver option when using sk build

- Add db_driver option when using sk build (currently supported: mysql, postgresql) 

## v1.7.0 - Refactor route:create to route:generate + Fix import (path depth) + New Angular version support

- Refactor route:create to route:generate
- Fix import (path depth)
- Support new versions of Angular

## v1.6.2 - Docker logs options

- Added docker logs options in docker-compose file created by sk build

## v1.6.1 - Minor changes from swagger doc

- Replace ApiOkResponse with ApiCreatedResponse in create function in nestjs controller
- Replace ApiOkResponse(Type) with ApiOkResponse(\[Type\]) in findAll function in nestjs controller

## v1.6.0 - Latest build options + Refactor frontend service

- Add latest build options feature
- Refactor frontend service

## v1.5.1 - Fix for Prisma Views

- Fix for Prisma Views

## v1.5.0 - More coherent docker compose names + production boolean

- Refactor docker compose names
- Change build command to set production=true if the variable exist

## v1.4.0 - Fix for single apps

- Fix skulljs json generation in sk new
- Fix sk build for single app

## v1.3.0 - Fix for Prisma schema + docker

- Fix for Prisma schema PK different of Auto increment number
- Fix for Prisma schema table name
- Fix docker files (puppeteer + names)

## v1.2.3 - Update text

- "Create the associated service ?" -> "Create the associated frontend service ?"

## v1.2.2 - Unit tests

- Added unit tests (partially for angular)
- Use Handlebars instead of ejs for easier indentation in templates
- Stop generating crud templates from commands instead includes them in their respetive parent templates

## v1.2.1 - Fix forwarding commands

- Fix System Tools - getLocalCli : output the right cwd and cli command
- Fix Forwarding - Use the right project definitions and add better error handling when spawning childprocess

## v1.2.0 - sk prisma

- Add sk prisma
- Updated error display when checking the cwd of the cli

## v1.1.0 - Prisma client api abstraction

- Change sk route:create for prisma client api abstraction

## v1.0.1 - Fix sk doc description

- Fix sk doc description

## v1.0.0 - Release

- Release of skulljs

## v0.9.11 - change sslcert

- sslcert -> ranme to xxx.key.pem and xxx.cert.pem

## v0.9.10 - sk doc

- Add sk doc

## v0.9.9 - improve sk build

- Rename buildCommand to build
- Add pm2 and docker logs commands for sk build
- Add MySQL port number for docker sk build
- sslcert -> rename to key.pem and cert.pem

## v0.9.8 - sk build

- Add sk build

## v0.9.7 - sk forward

- Add sk forward

## v0.9.6 - sk route

- Add sk route

## v0.9.5 - sk new

- Add sk new
- Fix npm version

## v0.9.1 - Toolbox + Structure

- Add toolbox + structure

## v0.9.0 - Init

- Init of the project
