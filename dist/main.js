"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
require("dotenv/config");
const app_module_1 = require("./app.module");
const dataTransformGlobalPipe_1 = require("./common/pipes/dataTransformGlobalPipe");
const swagger_2 = require("./swagger/swagger");
async function bootstrap() {
    const port = process.env.PORT;
    const host = process.env.SYSTEM_HOST;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new dataTransformGlobalPipe_1.DataTransformGlobalPipe());
    app.setGlobalPrefix('api');
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NEST Project')
        .setDescription('The NEST Project API description')
        .setVersion('1.0.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-doc/', app, document);
    await (0, swagger_2.default)(app);
    await app.listen(port);
    common_1.Logger.log(`Server is Running(🔥) on http://${host}:${port}/api/v1/`, 'NEST-BackendServer');
}
bootstrap();
//# sourceMappingURL=main.js.map