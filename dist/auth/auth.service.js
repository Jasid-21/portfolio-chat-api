"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const typeorm_2 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
let AuthService = exports.AuthService = class AuthService {
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.userRepo.findOneBy({ username });
        if (!user)
            throw new common_1.HttpException('Bad credentials', 404);
        const match = bcrypt.compareSync(password, user.password);
        if (!match)
            throw new common_1.HttpException('Bad credentials', 404);
        const raw_info_token = { Id: user.Id, username };
        const token = this.jwtService.sign(raw_info_token);
        const Id = user.Id;
        return { token, Id };
    }
    async register(registerDto) {
        try {
            const { username, password, confirmation } = registerDto;
            if (!username)
                return new common_1.HttpException('Username is required', 400);
            if (password != confirmation)
                return new common_1.HttpException('Password and confirmation must match', 400);
            if (!this.validatePassword(password))
                return new common_1.HttpException('Password must follow the requirements', 400);
            const exist = await this.userRepo.findOneBy({ username });
            if (exist)
                return new common_1.HttpException('This username alredy exist', 409);
            const hashed = bcrypt.hashSync(password, 10);
            const raw_user = this.userRepo.create({
                username,
                password: hashed,
            });
            const new_user = await this.userRepo.save(raw_user);
            const raw_info_token = { Id: new_user.Id, username };
            return this.jwtService.sign(raw_info_token);
        }
        catch (err) {
            return new common_1.HttpException('Sorry. There was a server error. Please, try later...', 500);
        }
    }
    validatePassword(password) {
        return true;
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map