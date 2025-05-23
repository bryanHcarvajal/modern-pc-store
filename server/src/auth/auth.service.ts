// server/src/auth/auth.service.ts
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
        .map(role => String(role).replace(/[{}]/g, ''))
        .filter(role => role.length > 0)
        .map(role => role as UserRole); 

      user.roles = cleanedRoles; 

      this.logger.debug(`AuthService - Roles ANTES (copia): ${JSON.stringify(originalRoles)} -> DESPUÉS (en instancia): ${JSON.stringify(user.roles)} para ${user.email}`);
    } else {
      this.logger.warn(`AuthService - Usuario ${user.email} no tiene una propiedad 'roles' válida (o no es array) para limpiar. Roles actuales: ${JSON.stringify(user.roles)}. Se asignarán roles por defecto [UserRole.USER].`);
      user.roles = [UserRole.USER];
    }
  }

  async register(createUserDto: CreateUserDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const userEntity: User = await this.usersService.create(createUserDto);
    
    this.logger.debug(`AuthService - userEntity después de usersService.create (antes de limpiar roles): ${JSON.stringify(userEntity)}`);
    this.cleanUserRolesInPlace(userEntity); 
    this.logger.debug(`AuthService - userEntity después de limpiar roles (en register): ${JSON.stringify(userEntity)}`);

    const { password, ...userResult } = userEntity;
    
    if (!userEntity.roles) { 
        this.logger.error(`CRÍTICO en register: userEntity.roles es ${userEntity.roles} para ${userEntity.email}.`);
        throw new Error("Fallo interno: Roles de usuario no procesados correctamente en register.");
    }
    
    const payload = { email: userEntity.email, sub: userEntity.id, roles: userEntity.roles };
    this.logger.debug(`AuthService - Payload JWT para register de ${userEntity.email}: ${JSON.stringify(payload)}`);
    const accessToken = this.jwtService.sign(payload);
    
    return { accessToken, user: userResult };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const { email, password: plainPassword } = loginUserDto;
    const userEntity: User | undefined = await this.usersService.findOneByEmail(email);

    if (!userEntity) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
    
    this.logger.debug(`AuthService - userEntity después de findOneByEmail (antes de limpiar roles): ${JSON.stringify(userEntity)}`);
    this.cleanUserRolesInPlace(userEntity); 
    this.logger.debug(`AuthService - userEntity después de limpiar roles (en login): ${JSON.stringify(userEntity)}`);


    const isPasswordMatching = await userEntity.comparePassword(plainPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const { password, ...userResult } = userEntity;
    
    if (!userEntity.roles) { 
        this.logger.error(`CRÍTICO en login: userEntity.roles es ${userEntity.roles} para ${userEntity.email}.`);
        throw new Error("Fallo interno: Roles de usuario no procesados correctamente en login.");
    }
    
    const payload = { email: userEntity.email, sub: userEntity.id, roles: userEntity.roles };
    this.logger.debug(`AuthService - Payload JWT para login de ${userEntity.email}: ${JSON.stringify(payload)}`);
    const accessToken = this.jwtService.sign(payload);
    
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