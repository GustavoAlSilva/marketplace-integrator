import { IsEmail, IsNotEmpty } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';

export class LoginDto {
  @IsNotEmpty({ message: MessagesHelper.EMAIL_REQUIRED })
  @IsEmail({}, { message: MessagesHelper.EMAIL_VALID })
  email: string;

  @IsNotEmpty({ message: MessagesHelper.PASSWORD_REQUIRED })
  password: string;
}
