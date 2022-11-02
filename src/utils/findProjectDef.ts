import path from 'path';
import { existsSync } from 'node:fs';

/**
 * Find kestre-cli file if it exist
 * @param from The starting directory to look for the file from
 * @returns Definition if found else null
 */
function findProjectDefinition(from: string): string | null {
  const root = path.parse(from).root;
  let currentDir = from;
  while (currentDir && currentDir !== root) {
    const definition = path.join(currentDir, 'skulljs-cli.json');
    if (existsSync(definition)) {
      return definition;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}
export default findProjectDefinition;
