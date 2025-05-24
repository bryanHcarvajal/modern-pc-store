// server/src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException, CanActivate, Logger } from '@nestjs/common'; // <--- AÑADIR Logger
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name); // <--- AÑADIR Logger instance

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('[JwtAuthGuard] No se proporcionó token de autenticación.');
      throw new UnauthorizedException('No se proporcionó token de autenticación.');
    }

    const secretForVerifying = this.configService.get<string>('JWT_SECRET');
    this.logger.debug(`[JwtAuthGuard] Intentando verificar token. Secreto usado (desde ConfigService): ${secretForVerifying}`);
    this.logger.debug(`[JwtAuthGuard] Token recibido para verificar: ${token}`);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretForVerifying, // Usar el secreto obtenido de ConfigService
      });
      this.logger.debug(`[JwtAuthGuard] Token verificado exitosamente. Payload: ${JSON.stringify(payload)}`);
      request['user'] = payload;
    } catch (e: any) { // Especificar tipo 'any' para acceder a e.message o e.name
      this.logger.error(`[JwtAuthGuard] Error al verificar token. Secreto usado fue: ${secretForVerifying}. Error: ${e.name} - ${e.message}`);
      // Podrías querer loguear el stack trace también: this.logger.error(e.stack);
      
      // Diferenciar tipos de errores de JWT si es posible
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token ha expirado.');
      } else if (e.name === 'JsonWebTokenError') { // Cubre 'invalid signature', 'jwt malformed', etc.
        throw new UnauthorizedException('Token inválido.');
      } else {
        throw new UnauthorizedException('Token inválido o expirado (error genérico).');
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, tokenValue] = authHeader.split(' ') ?? []; // Renombrado a tokenValue para evitar conflicto
    return type === 'Bearer' ? tokenValue : undefined;
  }
}