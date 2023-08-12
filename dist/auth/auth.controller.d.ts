import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        Id: number;
    }>;
    register(registerDto: RegisterDto): Promise<string | import("@nestjs/common").HttpException>;
}
