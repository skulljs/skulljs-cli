#!/usr/bin/env node

// check if we're running in dev mode
import * as url from 'url'
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const devMode = existsSync(`${__dirname}/../src`)

if (devMode) {
  console.log('Dev mode')
  execSync('npm run build', {
    cwd: `${__dirname}/..`,
    stdio: ['inherit', 'inherit', 'inherit'],
  })
}
let cliPath = url.pathToFileURL(`${__dirname}/../build/cli.js`)

const { default: run } = await import(cliPath)

run(process.argv)
