"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseAdminService {
    entityToDTO(entity) {
        return Promise.resolve(entity);
    }
    entityToDTOs(entities) {
        const dtos = [];
        for (const entity of entities) {
            dtos.push(entity);
        }
        return Promise.resolve(dtos);
    }
}
exports.default = BaseAdminService;
//# sourceMappingURL=base-admin-service.abstract.js.map