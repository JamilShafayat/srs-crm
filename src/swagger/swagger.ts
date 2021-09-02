import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import ModuleList from './module-list';

export default async function swagger(app) {
  for (const ModuleItem of ModuleList) {
    //swagger config
    const config = new DocumentBuilder()
      .setTitle('GSCS-Audit Application')
      .setDescription('The gscs-audit API description')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: [...ModuleItem.Module],
    });
    SwaggerModule.setup(
      'api-doc/' + ModuleItem.url.trim().replace(/^\//, ''),
      app,
      document,
    );
  }
}
