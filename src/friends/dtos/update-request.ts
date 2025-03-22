import { FRIEND_REQUESTS_ACTION, invalidActionType } from '../constants';
import { IsEnum } from 'class-validator';

export default class UpdateFriendRequestDto {
  @IsEnum(FRIEND_REQUESTS_ACTION, {
    message: invalidActionType,
  })
  action: FRIEND_REQUESTS_ACTION;
}
