import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto, SignInDto } from './auth.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.usersService.create(dto);
    return this.buildResponse(user);
  }

  async signIn(dto: SignInDto): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.usersService.validatePassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildResponse(user);
  }

  async me(userId: number): Promise<User> {
    return this.usersService.findById(userId);
  }

  private buildResponse(user: User): { user: Omit<User, 'password'>; accessToken: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const { password: _pw, ...safeUser } = user as any;
    return { user: safeUser, accessToken };
  }
}
