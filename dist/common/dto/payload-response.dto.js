"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadResponseDTO = exports.PayloadDTO = exports.MetadataDTO = exports.IMetadata = void 0;
const openapi = require("@nestjs/swagger");
class IMetadata {
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number }, totalCount: { required: true, type: () => Number }, totalPage: { required: false, type: () => Number }, limit: { required: true, type: () => Number } };
    }
}
exports.IMetadata = IMetadata;
class MetadataDTO extends IMetadata {
    constructor(page, totalCount, limit) {
        super();
        this.page = page;
        this.totalCount = totalCount;
        this.limit = limit;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.MetadataDTO = MetadataDTO;
class PayloadDTO {
    constructor(list, details) {
        this.list = list;
        this.details = details;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PayloadDTO = PayloadDTO;
class PayloadResponseDTO {
    constructor(response) {
        this.response = response;
        const metadata = response.metadata || {
            page: 1,
            totalPage: 1,
            totalCount: 1,
            limit: 1,
        };
        const totalPage = Math.ceil(metadata.totalCount / metadata.limit);
        this.statusCode = response.statusCode;
        this.message = response.message || '';
        this.metadata = Object.assign(Object.assign({}, metadata), { totalPage: totalPage });
        this.data = response.data || {};
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true, type: () => Number }, message: { required: false, type: () => String }, metadata: { required: false, type: () => require("./payload-response.dto").IMetadata }, data: { required: false, type: () => Object } };
    }
}
exports.PayloadResponseDTO = PayloadResponseDTO;
//# sourceMappingURL=payload-response.dto.js.map