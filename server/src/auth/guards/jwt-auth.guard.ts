import { Injectable, ExecutionContext, UnauthorizedException, CanActivate, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly HARCODED_JWT_SECRET_FOR_DEBUG = '7700194274tetatrio-zcatiplo25'; // <---  SECRETO DE RENDER

  constructor(
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('[JwtAuthGuard] No se proporcionó token de autenticación.');
      throw new UnauthorizedException('No se proporcionó token de autenticación.');
    }

    this.logger.debug(`[JwtAuthGuard] Intentando verificar token. Usando SECRETO HARCODEADO: ${this.HARCODED_JWT_SECRET_FOR_DEBUG}`);
    this.logger.debug(`[JwtAuthGuard] Token recibido para verificar: ${token}`);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.HARCODED_JWT_SECRET_FOR_DEBUG,
      });
      this.logger.debug(`[JwtAuthGuard] Token verificado exitosamente (con secreto hardcodeado). Payload: ${JSON.stringify(payload)}`);
      request['user'] = payload;
    } catch (e: any) {
      this.logger.error(`[JwtAuthGuard] Error al verificar token (con secreto hardcodeado). Error: ${e.name} - ${e.message}`);
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token ha expirado.');
      } else if (e.name === 'JsonWebTokenError') {
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
    const [type, tokenValue] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? tokenValue : undefined;
  }
}