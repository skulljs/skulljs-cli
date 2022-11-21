import { generateBackendDoc, generateFrontendDoc } from '@src/assets/doc/generateDocUtils.js';
import { Command } from '@src/types/command';
import { RepositorySkJson } from '@src/types/project';

const docCommand: Command = {
  name: 'doc',
  scope: 'in',
  description: 'Build the documentation for the frontend',
  run: async (toolbox, options, args) => {
    const {
      print: { infoLoader, warn },
      project: { frontend, backend },
      prompts,
    } = toolbox;

    //  Ask user
    const choices = [{ title: 'All', value: 'all' }];
    if (backend) {
      choices.push({ title: 'Backend', value: 'backend' });
    }
    if (frontend) {
      choices.push({ title: 'Frontend', value: 'frontend' });
    }
    const documentation_choice = await prompts.select('Select the documentation you want to generate', choices);

    // Generating backend documentation
    if (documentation_choice == 'all' || documentation_choice == 'backend') {
      toolbox.loader.start(infoLoader('Generating backend documentation'));
      await generateBackendDoc(backend as RepositorySkJson);
      await toolbox.loader.succeed();
    }

    // Generating frontend documentation
    if (documentation_choice == 'all' || documentation_choice == 'frontend') {
      toolbox.loader.start(infoLoader('Generating frontend documentation'));
      await generateFrontendDoc(frontend as RepositorySkJson);
      await toolbox.loader.succeed();
    }

    warn('Documentation is ready.');
  },
};

export default docCommand;
