/**
 * Use commander to exit with error and help
 * @param command Commander command object
 * @param message Message to display when exiting
 */
type SkExit = (command: Command, message: string | string[]) => void;
export { SkExit };
