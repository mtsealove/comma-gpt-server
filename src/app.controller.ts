import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateInfoDto } from './create.info.dto';
import * as Path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '질의 응답' })
  async getAnswer(@Query('question') question: string) {
    return this.appService.getAnswer(question);
  }

  @Get('/infos')
  @ApiOperation({ summary: '정보 전체 조회' })
  async getInfos() {
    return this.appService.getInfos();
  }

  @Post('/infos')
  @ApiOperation({ summary: '정보 생성' })
  async createInfo(@Body(ValidationPipe) dto: CreateInfoDto) {
    return this.appService.createInfo(dto);
  }

  @Patch('/infos/:id')
  @ApiOperation({ summary: '정보 수정' })
  async updateInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: CreateInfoDto,
  ) {
    return this.appService.updateInfo(id, dto);
  }

  @Delete('/infos/:id')
  @ApiOperation({ summary: '정보 삭제' })
  async deleteInfo(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteInfo(id);
  }
}
