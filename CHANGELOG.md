# Changelog

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
