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
        
        console.log('[AuthModule] JWT_SECRET desde ConfigService:', jwtSecret);
        console.log('[AuthModule] JWT_EXPIRATION_TIME desde ConfigService:', jwtExpiration);

        if (!jwtSecret || !jwtExpiration) {
          throw new Error('ConfigService no pudo leer JWT_SECRET o JWT_EXPIRATION_TIME del archivo .env');
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