import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (await this.users.findByEmail(normalizedEmail)) {
      throw new ConflictException('Email already exists.');
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await this.users.create(name.trim(), normalizedEmail, passwordHash);
      return this.toAuthResponse(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists.');
      }

      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email.trim().toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.toAuthResponse(user);
  }

  private toAuthResponse(user: { id: string; name: string; email: string; createdAt: Date; updatedAt: Date }) {
    return {
      data: {
        user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt },
        accessToken: this.jwt.sign({ sub: user.id }),
      },
    };
  }
}
