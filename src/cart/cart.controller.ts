import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  private getSessionId(headers: Record<string, string>): string {
    const sessionId = headers['x-session-id'];
    if (!sessionId) throw new BadRequestException('x-session-id header is required');
    return sessionId;
  }

  @Get()
  getCart(@Headers() headers: Record<string, string>) {
    return this.service.getOrCreateCart(this.getSessionId(headers));
  }

  @Post('items')
  addItem(@Headers() headers: Record<string, string>, @Body() dto: AddToCartDto) {
    return this.service.addItem(this.getSessionId(headers), dto);
  }

  @Put('items/:id')
  updateItem(
    @Headers() headers: Record<string, string>,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.service.updateItem(this.getSessionId(headers), id, dto);
  }

  @Delete('items/:id')
  removeItem(
    @Headers() headers: Record<string, string>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.removeItem(this.getSessionId(headers), id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clearCart(@Headers() headers: Record<string, string>) {
    return this.service.clearCart(this.getSessionId(headers));
  }
}
