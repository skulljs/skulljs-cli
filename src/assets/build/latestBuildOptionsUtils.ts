import toolbox from '@src/toolbox/toolbox.js';
import { LatestBuildOptions } from '@src/types/project';

const { fileSystem } = toolbox;

export async function saveLatestBuildOptions(projecDefPath: string, latestBuildOptions: LatestBuildOptions) {
  const skCliJson = await fileSystem.readAsync(projecDefPath, 'json');
  skCliJson.latest_build_options = {
    app_name: latestBuildOptions.app_name,
    hostname: latestBuildOptions.hostname,
    port: latestBuildOptions.port,
    db_driver: latestBuildOptions.db_driver,
    protocol: latestBuildOptions.protocol,
    manager: latestBuildOptions.manager,
  };
  await fileSystem.writeAsync(projecDefPath, JSON.stringify(skCliJson, null, 2));
}

export default {
  saveLatestBuildOptions,
};
