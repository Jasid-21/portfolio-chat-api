import { HttpException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        Id: number;
    }>;
    register(registerDto: RegisterDto): Promise<string | HttpException>;
    validatePassword(password: string): boolean;
}
