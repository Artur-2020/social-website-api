import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { validations } from '../../constants';
import { passwordDoesNotMatch, passwordMsg } from '../constants';
import { Match } from '../decorators/match.decorator';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';
import { ApiProperty } from '@nestjs/swagger';

const { notEmpty, lengthMsg, invalidItem } = validations;

export default class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    maxLength: 30,
  })
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'First Name' }),
  })
  @Length(2, 30, {
    message: modifyStringWithValues(lengthMsg, {
      item: 'First Name',
      max: 20,
      min: 2,
    }),
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 30,
  })
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'Last Name' }),
  })
  @Length(2, 30, {
    message: modifyStringWithValues(lengthMsg, {
      item: 'Last Name',
      max: 30,
      min: 2,
    }),
  })
  lastName: string;

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
    description: 'User age',
    example: 25,
    minimum: 13,
  })
  @IsInt()
  @Min(13)
  age: number;

  @ApiProperty({
    description:
      'User password (must contain at least one number, one letter, and one special character (!@#$%^&*))',
    example: 'Password123!',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'Password' }),
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

  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'Password123!',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'Password' }),
  })
  @Length(8, 20, {
    message: modifyStringWithValues(lengthMsg, {
      item: 'confirm password',
      max: 20,
      min: 8,
    }),
  })
  @Match('password', { message: passwordDoesNotMatch })
  confirmPassword: string;
}
