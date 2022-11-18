import prompts from 'prompts';
/**
 * Execute code when prompts are interupted
 */
function cancelProcess() {
    process.exit(0);
}
async function confirm(message, initial = false) {
    const { yesno } = await prompts({
        type: 'toggle',
        name: 'yesno',
        message: message,
        initial: initial,
        active: 'yes',
        inactive: 'no',
    }, {
        onCancel: cancelProcess,
    });
    return yesno;
}
async function ask(message, validate = (input) => {
    return true;
}, initial = '') {
    const { response } = await prompts({
        type: 'text',
        name: 'response',
        initial: initial,
        message: message,
        validate: validate,
    }, {
        onCancel: cancelProcess,
    });
    return response;
}
async function select(message, choices, initial = 0) {
    const response = (await prompts({
        type: 'select',
        name: 'response',
        message: message,
        choices: choices,
        initial: initial,
    }, {
        onCancel: cancelProcess,
    })).response;
    return response;
}
async function multiSelect(message, choices, initial = 0) {
    const response = (await prompts({
        type: 'autocompleteMultiselect',
        name: 'response',
        instructions: false,
        hint: 'A - Toggle All, Space - Toggle Select',
        message: message,
        choices: choices,
        initial: initial,
    }, {
        onCancel: cancelProcess,
    })).response;
    return response;
}
async function askList(message, initial = '') {
    const { response } = await prompts({
        type: 'list',
        name: 'response',
        message: message,
        initial: initial,
        separator: ',',
    }, {
        onCancel: cancelProcess,
    });
    return response;
}
async function any(questions) {
    const responses = await prompts(questions, {
        onCancel: cancelProcess,
    });
    return responses;
}
const inject = prompts.inject;
const prompt = {
    confirm,
    ask,
    select,
    multiSelect,
    askList,
    any,
    inject,
};
export { prompt };
