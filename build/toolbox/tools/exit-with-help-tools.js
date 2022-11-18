function exit(command, message) {
    if (Array.isArray(message)) {
        message = message.join('\n');
    }
    command.error(message);
}
const exitHelp = exit;
export { exitHelp };
