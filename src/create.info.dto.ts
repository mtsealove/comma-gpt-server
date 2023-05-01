import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  data: string;
}
