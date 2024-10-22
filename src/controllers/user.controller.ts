import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserModels } from 'src/models/user.models';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() data: UserModels.CreateReq) {
    return this.userService.create(data);
  }

  @Put(':id')
  update(
    @Body() data: UserModels.UpdateReq,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModels.Res[]> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<{ result: boolean }> {
    return this.userService.delete(id);
  }

  @Get()
  getAll(@Query() data: UserModels.GetAllReq): Promise<UserModels.Res[]> {
    return this.userService.getAll(data);
  }
}
