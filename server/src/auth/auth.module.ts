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
      useFactory: async () => { 
        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiration = process.env.JWT_EXPIRATION_TIME;

        console.log('[AuthModule] JWT_SECRET desde process.env:', jwtSecret);
        console.log('[AuthModule] JWT_EXPIRATION_TIME desde process.env:', jwtExpiration);

        if (!jwtSecret) {
          console.error('[AuthModule] ERROR CRÍTICO: JWT_SECRET (desde process.env) es undefined o vacío.');
          throw new Error('JWT_SECRET no está definido en las variables de entorno (process.env).');
        }
        if (!jwtExpiration) {
          console.error('[AuthModule] ERROR CRÍTICO: JWT_EXPIRATION_TIME (desde process.env) es undefined o vacío.');
          throw new Error('JWT_EXPIRATION_TIME no está definido en las variables de entorno (process.env).');
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