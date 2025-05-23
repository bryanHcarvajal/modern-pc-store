import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate { 
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {} 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No se proporcionó token de autenticación.');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'), 
      });
      request['user'] = payload; 
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined { 
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}