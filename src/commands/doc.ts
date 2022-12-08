import { DocFactory } from '@src/assets/doc/docFactory.js';
import { Command } from '@src/types/command';

const docCommand: Command = {
  name: 'doc',
  scope: 'in',
  description: 'Build the documentation',
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
      const backendUtils = DocFactory.getProject(backend!.skulljs_repository);
      toolbox.loader.start(infoLoader('Generating backend documentation'));
      await backendUtils.generateDoc(backend!);
      await toolbox.loader.succeed();
    }

    // Generating frontend documentation
    if (documentation_choice == 'all' || documentation_choice == 'frontend') {
      const frontendUtils = DocFactory.getProject(frontend!.skulljs_repository);
      toolbox.loader.start(infoLoader('Generating frontend documentation'));
      await frontendUtils.generateDoc(frontend!);
      await toolbox.loader.succeed();
    }

    warn('Documentation is ready.');
  },
};

export default docCommand;
