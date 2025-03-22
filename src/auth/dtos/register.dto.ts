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
import { Match } from '../../users/decorators/match.decorator';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';

const { notEmpty, lengthMsg, invalidItem } = validations;

export default class RegisterDto {
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

  @IsNotEmpty({ message: modifyStringWithValues(notEmpty, { item: 'Email' }) })
  @IsEmail(
    {},
    { message: modifyStringWithValues(invalidItem, { item: 'Email' }) },
  )
  email: string;

  @IsInt()
  @Min(13)
  age: number;
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

  // @ts-ignore
  @Match('password', { message: passwordDoesNotMatch })
  confirmPassword: string;
}
