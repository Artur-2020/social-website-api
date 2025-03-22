import { IsNotEmpty } from 'class-validator';
import { validations } from '../../constants';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';

const { notEmpty } = validations;

export default class RefreshDto {
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'refresh_token' }),
  })
  refresh_token: string;
}
