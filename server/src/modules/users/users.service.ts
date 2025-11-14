import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

export type SanitizedUser = Omit<User, 'passwordHash' | 'hashPassword'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SanitizedUser> {
    const { email, username } = createUserDto;
    const emailExisting = await this.findByEmail(email);
    if (emailExisting) {
      throw new ConflictException('Email Already Exists');
    }

    const usernameExisting = await this.findByUsername(username);
    if (usernameExisting) {
      throw new ConflictException('Username Already Exists');
    }

    const user = this.usersRepository.create({
      username,
      email,
      name: createUserDto.name,
      publicKey: createUserDto.publicKey,
      avatarUrl: createUserDto.avatarUrl,
      passwordHash: createUserDto.password,
      isVerified: createUserDto.isVerified ?? false,
    });
    try {
      const savedUser = await this.usersRepository.save(user);
      return this.toSafeUser(savedUser);
    } catch (err) {
      throw new InternalServerErrorException('Error Creating User');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email, isDeleted: false, isActive: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id, isDeleted: false, isActive: true },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { username, isDeleted: false, isActive: true },
    });
  }

  async getProfile(user: {
    id?: number;
    username?: string;
  }): Promise<SanitizedUser> {
    if (!user.id && !user.username) {
      throw new NotFoundException();
    }
    const userData = user.id
      ? await this.findById(user.id)
      : await this.findByUsername(user.username as string);
    if (!userData) {
      throw new NotFoundException();
    }
    return this.toSafeUser(userData);
  }

  async verifyUser(email: string): Promise<SanitizedUser> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    user.isVerified = true;
    const updatedUser = await this.usersRepository.save(user);
    return this.toSafeUser(updatedUser);
  }

  toSafeUser(user: User): SanitizedUser {
    const safeUser = { ...user } as Partial<User>;
    delete safeUser.passwordHash;
    delete (safeUser as Record<string, unknown>).hashPassword;
    return safeUser as SanitizedUser;
  }
}
