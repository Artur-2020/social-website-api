import { IsUUID, IsNotEmpty } from 'class-validator';
import { validations } from '../../constants';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';
import { ApiProperty } from '@nestjs/swagger';

const { notEmpty, invalidItem } = validations;

export default class FriendRequestDto {
  @ApiProperty({
    description: 'ID of the user to send friend request to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'Receiver ID' }),
  })
  @IsUUID('4', {
    message: modifyStringWithValues(invalidItem, { item: 'Receiver ID' }),
  })
  receiverId: string;
}
