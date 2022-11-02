import { FilesToTransform } from '@src/types/commands/new'

const front_files: FilesToTransform = {
  toTransform: [
    {
      path: 'angular-node/frontend/',
      part: 'frontend/',
      convert: true,
      filename: 'package.json',
      createPath: '',
      replace: [
        {
          this: 'frontend',
          by: "<%= props.fname || 'frontend' %>",
        },
      ],
    },
  ],
}

export default front_files
