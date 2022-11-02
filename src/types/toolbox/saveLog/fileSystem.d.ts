export interface FileSystemUpdate {
  action: FsAction
  path: string
  size: number
}
export interface FilesCreated {
  [key: string]: boolean
}
