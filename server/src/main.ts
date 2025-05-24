import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); 

  const allowedOrigins = [
    'http://localhost:5173',
    'https://modern-pc-store.vercel.app'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        logger.log(`CORS: Origen permitido - ${origin || 'sin origen (ej. Postman)'}`);
        callback(null, true);
      } else {
        logger.error(`CORS: Origen RECHAZADO - ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
    exposedHeaders: 'Content-Length, Content-Range',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Servidor NestJS corriendo en: http://localhost:${port} y accesible externamente en el puerto ${port}`);
}
bootstrap();