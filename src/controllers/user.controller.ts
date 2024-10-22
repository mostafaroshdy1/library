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
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserModels } from 'src/models/user.models';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() data: UserModels.CreateReq) {
    return this.userService.create(data);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Body() data: UserModels.UpdateReq,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModels.Res[]> {
    return this.userService.update(id, data);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<{ result: boolean }> {
    return this.userService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  getAll(@Query() data: UserModels.GetAllReq): Promise<UserModels.Res[]> {
    return this.userService.getAll(data);
  }
}
