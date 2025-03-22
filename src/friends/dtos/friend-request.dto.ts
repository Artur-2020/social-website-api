import { IsUUID, IsNotEmpty } from 'class-validator';
import { validations } from '../../constants';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';

const { notEmpty, invalidItem } = validations;

export default class FriendRequestDto {
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'Receiver ID' }),
  })
  @IsUUID('4', {
    message: modifyStringWithValues(invalidItem, { item: 'Receiver ID' }),
  })
  receiverId: string;
}
