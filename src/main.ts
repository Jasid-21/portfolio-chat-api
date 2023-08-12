import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function bootstrap() {
  NestFactory.create(AppModule).then((app) => {
    app.enableCors({ origin: '*' });
    app.listen(process.env.PORT || 3000);
  });
}
bootstrap();
