import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 

@Module({
  imports: [
    UsersModule,
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const jwtExpiration = configService.get<string>('JWT_EXPIRATION_TIME');

        console.log('[AuthModule] JWT_SECRET leído por ConfigService:', jwtSecret);
        console.log('[AuthModule] JWT_EXPIRATION_TIME leído por ConfigService:', jwtExpiration);

        if (!jwtSecret) {
          console.error('[AuthModule] ERROR CRÍTICO: JWT_SECRET es undefined o vacío.');
          throw new Error('JWT_SECRET no está definido en las variables de entorno.');
        }
        if (!jwtExpiration) {
          console.error('[AuthModule] ERROR CRÍTICO: JWT_EXPIRATION_TIME es undefined o vacío.');
          throw new Error('JWT_EXPIRATION_TIME no está definido en las variables de entorno.');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiration, 
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}