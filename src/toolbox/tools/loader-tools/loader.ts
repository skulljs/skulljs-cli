import ora, { Options } from 'ora';
const loaderOptions: Options = JSON.parse(process.argv[2]);
const loader = ora(loaderOptions);
loader.start();

process.on('message', (m) => {
  switch (m) {
    case 'succeed':
      {
        loader.succeed();
      }
      break;
    case 'fail':
      {
        loader.fail();
      }
      break;
  }
  if (process.send) {
    process.send('done');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  loader.fail();
});
