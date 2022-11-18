import toolbox from '../toolbox/toolbox.js';
Array.prototype.toPromptChoices = function (titleKey = undefined) {
    return this.reduce((result, value) => {
        let title = value;
        if (titleKey) {
            title = value[titleKey];
        }
        if (typeof title !== 'undefined') {
            const choice = { title: title.toString(), value: value };
            result.push(choice);
        }
        else {
            toolbox.print.error(`[Error] Key ${titleKey} was not found in ${JSON.stringify(this)}.toPromptChoices()`);
        }
        return result;
    }, []);
};
