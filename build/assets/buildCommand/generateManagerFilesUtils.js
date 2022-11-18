import toolbox from '../../toolbox/toolbox.js';
const { command, exit, template } = toolbox;
export async function generateManagerFiles(backend, output_path, manager, app_name, port) {
    switch (backend.skulljs_repository) {
        case 'nestjs':
            await generateNestJsManagerFiles(output_path, manager, app_name, port);
            break;
        default:
            exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
            break;
    }
}
async function generateNestJsManagerFiles(output_path, manager, app_name, port) {
    const props = { app_name: app_name, script_path: './src/main.js', port: port, dockerfile_opt_runs: ['RUN npx prisma generate'] };
    switch (manager) {
        case 'pm2':
            {
                await template.generate({
                    template: 'buildCommand/pm2/pm2.ecosystem.json.ejs',
                    target: `${output_path}/pm2.ecosystem.json.ejs`.replace('.ejs', ''),
                    props: props,
                });
            }
            break;
        case 'docker':
            {
                await template.generate({
                    template: 'buildCommand/docker/.dockerignore.ejs',
                    target: `${output_path}/.dockerignore.ejs`.replace('.ejs', ''),
                    props: props,
                });
                await template.generate({
                    template: 'buildCommand/docker/docker-compose.yml.ejs',
                    target: `${output_path}/docker-compose.yml.ejs`.replace('.ejs', ''),
                    props: props,
                });
                await template.generate({
                    template: 'buildCommand/docker/Dockerfile.ejs',
                    target: `${output_path}/Dockerfile.ejs`.replace('.ejs', ''),
                    props: props,
                });
            }
            break;
    }
}
export default {
    generateManagerFiles,
};
