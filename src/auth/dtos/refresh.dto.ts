import { IsNotEmpty } from 'class-validator';
import { validations } from '../../constants';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';
import { ApiProperty } from '@nestjs/swagger';

const { notEmpty } = validations;

export default class RefreshDto {
  @ApiProperty({
    description: 'Refresh token received from login or previous refresh',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({
    message: modifyStringWithValues(notEmpty, { item: 'refresh_token' }),
  })
  refresh_token: string;
}
