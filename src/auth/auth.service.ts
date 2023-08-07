import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user: User = await this.userRepo.findOneBy({ username });
    if (!user) throw new HttpException('Bad credentials', 404);

    const match = bcrypt.compareSync(password, user.password);
    if (!match) throw new HttpException('Bad credentials', 404);

    const raw_info_token = { Id: user.Id, username };
    const token = this.jwtService.sign(raw_info_token);
    const Id = user.Id;
    return { token, Id };
  }

  async register(registerDto: RegisterDto) {
    try {
      const { username, password, confirmation } = registerDto;
      if (!username) return new HttpException('Username is required', 400);
      if (password != confirmation)
        return new HttpException('Password and confirmation must match', 400);
      if (!this.validatePassword(password))
        return new HttpException('Password must follow the requirements', 400);

      const exist = await this.userRepo.findOneBy({ username });
      if (exist) return new HttpException('This username alredy exist', 409);

      const hashed = bcrypt.hashSync(password, 10);
      const raw_user = this.userRepo.create({
        username,
        password: hashed,
      });
      const new_user = await this.userRepo.save(raw_user);

      const raw_info_token = { Id: new_user.Id, username };
      return this.jwtService.sign(raw_info_token);
    } catch (err) {
      return new HttpException(
        'Sorry. There was a server error. Please, try later...',
        500,
      );
    }
  }

  validatePassword(password: string): boolean {
    return true;
  }
}
