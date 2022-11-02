import { FilesToTransform } from '@src/types/commands/new'

const back_files: FilesToTransform = {
  toTransform: [
    {
      path: 'angular-node/backend/',
      part: 'backend/',
      filename: 'package.json',
      convert: true,
      createPath: '',
      replace: [
        {
          this: 'backend',
          by: "<%= props.bname || 'backend' %>",
        },
      ],
    },
  ],
}

export default back_files
