/**
 * Add the running commander command tot the toolbox
 * @param toolbox The cli toolbox
 * @param command The command that is being run
 */
function setCommand(toolbox, command) {
    toolbox.command = command;
}
export default setCommand;
