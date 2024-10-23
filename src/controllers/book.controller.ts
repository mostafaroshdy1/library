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
import { ResponseModels } from 'src/common/models/response.model';
import { BookModels } from 'src/models/book.models';
import { BookService } from 'src/services/book.service';

@UseGuards(AccessTokenGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() data: BookModels.CreateReq): Promise<BookModels.CreateRes[]> {
    return this.bookService.create(data);
  }

  @Put(':id')
  update(
    @Body() data: BookModels.UpdateReq,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookModels.CreateRes[]> {
    return this.bookService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseModels.ack> {
    return this.bookService.delete(id);
  }

  @Get()
  getAll(@Query() data: BookModels.GetAllReq): Promise<BookModels.GetAllRes[]> {
    return this.bookService.getAll(data);
  }

  @Post('borrow')
  borrow(@Body() data: BookModels.BorrowReq): Promise<ResponseModels.ack> {
    return this.bookService.borrowBook(data);
  }

  @Post('return')
  return(@Body() data: BookModels.ReturnReq): Promise<ResponseModels.ack> {
    return this.bookService.returnBook(data);
  }
}
