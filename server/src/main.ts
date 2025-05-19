import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, 
  });

 
  const port = process.env.PORT || 3000;  
  await app.listen(port);
  console.log(`🚀 Servidor NestJS corriendo en: http://localhost:${port}`);
}
bootstrap();