import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { LoginDto } from './login.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user || !compareSync(password, user.password)) {
      throw new UnauthorizedException(MessagesHelper.PASSWORD_OR_EMAIL_INVALID);
    }

    const { id, firstName } = user;
    return { id, firstName };
  }
}
