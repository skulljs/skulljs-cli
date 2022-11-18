import toolbox from '../../toolbox/toolbox.js';
import asyncForEach from '../../utils/asyncForEach.js';
const { command, template, exit } = toolbox;
export function getBackendFilesToGenerates(skulljs_repository, props) {
    let filesToGenerates = [];
    switch (skulljs_repository) {
        case 'nestjs':
            filesToGenerates = getBackendNestJsFilesToGenerates(props);
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
    return filesToGenerates;
}
function getBackendNestJsFilesToGenerates(props) {
    return [
        {
            template: 'route-create/backend/nestjs/route.module.ts.ejs',
            target: `${props.backend_route_folder}/${'route.module.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/route.service.ts.ejs',
            target: `${props.backend_route_folder}/${'route.service.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/route.service.spec.ts.ejs',
            target: `${props.backend_route_folder}/${'route.service.spec.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/route.controller.ts.ejs',
            target: `${props.backend_route_folder}/${'route.controller.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/route.controller.spec.ts.ejs',
            target: `${props.backend_route_folder}/${'route.controller.spec.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/entities/model.entity.ts.ejs',
            target: `${props.backend_route_folder}/${'/entities/model.entity.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/dto/create-model.dto.ts.ejs',
            target: `${props.backend_route_folder}/${'/dto/create-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/backend/nestjs/dto/update-model.dto.ts.ejs',
            target: `${props.backend_route_folder}/${'/dto/update-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
        },
    ];
}
export async function getBackendCRUDData(skulljs_repository, props) {
    let backend_crud_data;
    switch (skulljs_repository) {
        case 'nestjs':
            backend_crud_data = await getBackendNestJsCRUDFiles(props);
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
    return backend_crud_data;
}
async function getBackendNestJsCRUDFiles(props) {
    let backend_crud_data = { service: '', controller: '' };
    if (props.crud) {
        const crud_array_service = [];
        const crud_array_controller = [];
        await asyncForEach(props.crud, async (crud_element) => {
            const crud_file_service = await template.generate({
                template: `route-create/backend/nestjs/service/crud/${crud_element}.ejs`,
                props: props,
            });
            crud_array_service.push(crud_file_service);
            const crud_file_controller = await template.generate({
                template: `route-create/backend/nestjs/controller/crud/${crud_element}.ejs`,
                props: props,
            });
            crud_array_controller.push(crud_file_controller);
        });
        backend_crud_data.service = crud_array_service.join('\n');
        backend_crud_data.controller = crud_array_controller.join('\n');
    }
    return backend_crud_data;
}
export function getFrontendFilesToGenerates(skulljs_repository, props) {
    let filesToGenerates = [];
    switch (skulljs_repository) {
        case 'angular':
            filesToGenerates = getFrontendAngularFilesToGenerates(props);
            break;
        default:
            exit(command, `frontend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
    return filesToGenerates;
}
function getFrontendAngularFilesToGenerates(props) {
    return [
        {
            template: 'route-create/frontend/angular/route.service.ts.ejs',
            target: `${props.frontend_service_folder}/${'route.service.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/frontend/angular/route.service.spec.ts.ejs',
            target: `${props.frontend_service_folder}/${'route.service.spec.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/frontend/angular/entities/model.entity.ts.ejs',
            target: `${props.frontend_service_folder}/${'/entities/model.entity.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/frontend/angular/dto/create-model.dto.ts.ejs',
            target: `${props.frontend_service_folder}/${'/dto/create-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
        },
        {
            template: 'route-create/frontend/angular/dto/update-model.dto.ts.ejs',
            target: `${props.frontend_service_folder}/${'/dto/update-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
        },
    ];
}
export async function getFrontendCRUDData(skulljs_repository, props) {
    let frontend_crud_data;
    switch (skulljs_repository) {
        case 'angular':
            frontend_crud_data = await getFrontendAngularCRUDFiles(props);
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
    return frontend_crud_data;
}
async function getFrontendAngularCRUDFiles(props) {
    let frontend_crud_data = { service: '' };
    if (props.crud) {
        const crud_array_service = [];
        await asyncForEach(props.crud, async (crud_element) => {
            const crud_file_service = await template.generate({
                template: `route-create/frontend/angular/service/crud/${crud_element}.ejs`,
                props: props,
            });
            crud_array_service.push(crud_file_service);
        });
        frontend_crud_data.service = crud_array_service.join('\n');
    }
    return frontend_crud_data;
}
export default {
    getBackendFilesToGenerates,
    getBackendCRUDData,
    getFrontendFilesToGenerates,
    getFrontendCRUDData,
};
