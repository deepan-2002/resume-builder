import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SanitizedUser, UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type JwtConfig = {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<SanitizedUser> {
    return await this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('No account found for this username');
    }
    const isValid = await this.validatePassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    const tokens = await this.generateTokens(
      user.id,
      user.username,
      user.email,
    );
    return {
      user: this.usersService.toSafeUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    const jwtConfig = this.getJwtConfig();
    let payload: { sub: string | number; username: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConfig.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = this.normalizeUserId(payload.sub);
    if (userId === null) {
      throw new UnauthorizedException('Invalid token-user pair');
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token-user pair');
    }

    return this.generateTokens(user.id, user.username, user.email);
  }

  async logout(userPayload: any, refreshToken: string) {
    if (!userPayload?.sub && !userPayload?.id) {
      throw new UnauthorizedException();
    }

    const jwtConfig = this.getJwtConfig();
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConfig.refreshSecret,
      });
      const tokenUserId = this.normalizeUserId(payload.sub);
      const requestUserId = this.normalizeUserId(
        userPayload.id ?? userPayload.sub ?? userPayload.userId,
      );
      if (
        tokenUserId === null ||
        requestUserId === null ||
        tokenUserId !== requestUserId
      ) {
        throw new ForbiddenException('Token does not belong to this user');
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { message: 'Logged out successfully' };
  }

  async me(userPayload: any) {
    const userId = this.normalizeUserId(userPayload?.id ?? userPayload?.sub);
    return this.usersService.getProfile({
      id: userId ?? undefined,
      username: userPayload?.username,
    });
  }

  private async validatePassword(plainPassword: string, hashPassword: string) {
    return await bcrypt.compare(plainPassword, hashPassword);
  }

  private async generateTokens(
    userId: number,
    username: string,
    email: string,
  ) {
    const jwtConfig = this.getJwtConfig();
    const payload = { sub: userId, username, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private getJwtConfig(): JwtConfig {
    const config = this.configService.get<JwtConfig>('jwt');
    if (!config) {
      throw new Error('JWT config not provided');
    }
    return config;
  }

  private normalizeUserId(id: unknown): number | null {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) {
      return null;
    }
    return parsed;
  }
}
