import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { validations } from '../../constants';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';
import { passwordMsg } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

const { notEmpty, lengthMsg, invalidItem } = validations;

export default class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsNotEmpty({ message: modifyStringWithValues(notEmpty, { item: 'Email' }) })
  @IsEmail(
    {},
    { message: modifyStringWithValues(invalidItem, { item: 'Email' }) },
  )
  email: string;

  @ApiProperty({
    description:
      'User password (must contain at least one number, one letter, and one special character (!@#$%^&*))',
    example: 'Password123!',
    minLength: 8,
    maxLength: 20,
  })
  @Length(8, 20, {
    message: modifyStringWithValues(lengthMsg, {
      item: 'password',
      max: 20,
      min: 8,
    }),
  })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/, { message: passwordMsg })
  password: string;
}
