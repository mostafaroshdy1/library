import { Body, Controller, Post } from '@nestjs/common';
import { UserModels } from 'src/models/user.models';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() data: UserModels.CreateReq) {
    return this.userService.create(data);
  }
}
