"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
require("dotenv/config");
const module_list_1 = require("./module-list");
async function swagger(app) {
    for (const ModuleItem of module_list_1.default) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('GSCS-Audit Application')
            .setDescription('The gscs-audit API description')
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config, {
            include: [...ModuleItem.Module],
        });
        swagger_1.SwaggerModule.setup('api-doc/' + ModuleItem.url.trim().replace(/^\//, ''), app, document);
    }
}
exports.default = swagger;
//# sourceMappingURL=swagger.js.map