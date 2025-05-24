import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private cleanUserRolesInPlace(user: User): void {
    if (!user) {
      this.logger.warn(`AuthService - cleanUserRolesInPlace fue llamado con un usuario nulo/undefined.`);
      return;
    }
    this.logger.debug(`AuthService - Entrando a cleanUserRolesInPlace para ${user.email}. Roles actuales: ${JSON.stringify(user.roles)}`);
    if (user.roles && Array.isArray(user.roles)) {
      const originalRoles = [...user.roles];
      const cleanedRoles: UserRole[] = user.roles
        .map(role => String(role).replace(/[{}]/g, '').toUpperCase().trim())
        .filter(role => role.length > 0)
        .filter(role => Object.values(UserRole).includes(role as UserRole))
        .map(role => role as UserRole);
      user.roles = cleanedRoles.length > 0 ? cleanedRoles : [UserRole.USER];
      this.logger.debug(`AuthService - Roles ANTES (copia): ${JSON.stringify(originalRoles)} -> DESPUÉS (en instancia): ${JSON.stringify(user.roles)} para ${user.email}`);
    } else {
      this.logger.warn(`AuthService - Usuario ${user.email} no tiene 'roles' válidos. Se asignarán roles por defecto [UserRole.USER].`);
      user.roles = [UserRole.USER];
    }
  }

  async register(createUserDto: CreateUserDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const userEntity: User = await this.usersService.create(createUserDto);
    this.cleanUserRolesInPlace(userEntity);

    const { password, ...userResult } = userEntity;
    if (!userEntity.roles || userEntity.roles.length === 0) {
        this.logger.error(`CRÍTICO en register: userEntity.roles está vacío o no definido para ${userEntity.email}. Asignando USER por defecto ANTES de firmar token.`);
        userEntity.roles = [UserRole.USER];
    }
    
    const payload = { email: userEntity.email, sub: userEntity.id, roles: userEntity.roles };
    this.logger.debug(`AuthService REGISTER - Payload JWT: ${JSON.stringify(payload)}`);
    const accessToken = this.jwtService.sign(payload); 
    this.logger.debug(`AuthService - Token generado para REGISTER de ${userEntity.email}: ${accessToken}`);
    return { accessToken, user: userResult };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const { email, password: plainPassword } = loginUserDto;
    const userEntity: User | undefined = await this.usersService.findOneByEmail(email);

    if (!userEntity) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
    this.cleanUserRolesInPlace(userEntity);

    const isPasswordMatching = await userEntity.comparePassword(plainPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const { password, ...userResult } = userEntity;
    if (!userEntity.roles || userEntity.roles.length === 0) {
        this.logger.error(`CRÍTICO en login: userEntity.roles está vacío o no definido para ${userEntity.email}. Asignando USER por defecto ANTES de firmar token.`);
        userEntity.roles = [UserRole.USER];
    }
    
    const payload = { email: userEntity.email, sub: userEntity.id, roles: userEntity.roles };
    this.logger.debug(`AuthService LOGIN - Payload JWT: ${JSON.stringify(payload)}`);
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(`AuthService - Token generado para LOGIN de ${userEntity.email}: ${accessToken}`);
    return { accessToken, user: userResult };
  }

  async validateUserById(userId: string): Promise<Partial<User> | undefined> {
    const userEntity = await this.usersService.findOneById(userId);
    if (userEntity) {
        this.cleanUserRolesInPlace(userEntity);
        const { password, ...result } = userEntity;
        return result;
    }
    return undefined;
  }
}