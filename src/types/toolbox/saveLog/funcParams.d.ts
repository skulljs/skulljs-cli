import { CopyOptions, WriteOptions } from 'fs-jetpack/types'
import { RunOptions } from '../child-process-options'
import { Options } from '../template-tools'
import { FsAction } from './fileSystem'

export interface CopyParams {
  from: string
  target: string
  options?: CopyOptions
}

export interface WriteParams {
  target: string
  content: Object | String | any[] | Buffer
  options?: WriteOptions
}

export interface RunParams {
  command: string
  args?: string
  target?: string
  action?: FsAction
  options?: RunOptions
}

export type ArgsTypes = RunParams | CopyParams | WriteParams | Options | any
