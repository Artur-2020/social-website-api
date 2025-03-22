import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { validations } from '../../constants';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';
import { passwordMsg } from '../constants';

const { notEmpty, lengthMsg, invalidItem } = validations;

export default class LoginDto {
  @IsNotEmpty({ message: modifyStringWithValues(notEmpty, { item: 'Email' }) })
  @IsEmail(
    {},
    { message: modifyStringWithValues(invalidItem, { item: 'Email' }) },
  )
  email: string;

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
