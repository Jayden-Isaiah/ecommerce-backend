import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly itemRepo: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(sessionId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { sessionId } });
    if (!cart) {
      cart = await this.cartRepo.save(this.cartRepo.create({ sessionId }));
    }
    return cart;
  }

  async addItem(sessionId: string, dto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(sessionId);
    await this.productsService.findOne(dto.productId); // validate product exists

    const existing = await this.itemRepo.findOne({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existing) {
      await this.itemRepo.update(existing.id, { quantity: existing.quantity + dto.quantity });
    } else {
      await this.itemRepo.save(
        this.itemRepo.create({ cartId: cart.id, productId: dto.productId, quantity: dto.quantity }),
      );
    }

    return this.getOrCreateCart(sessionId);
  }

  async updateItem(sessionId: string, itemId: number, dto: UpdateCartItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(sessionId);
    const item = await this.itemRepo.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundException(`Cart item #${itemId} not found`);
    await this.itemRepo.update(itemId, { quantity: dto.quantity });
    return this.getOrCreateCart(sessionId);
  }

  async removeItem(sessionId: string, itemId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(sessionId);
    const item = await this.itemRepo.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundException(`Cart item #${itemId} not found`);
    await this.itemRepo.delete(itemId);
    return this.getOrCreateCart(sessionId);
  }

  async clearCart(sessionId: string): Promise<void> {
    const cart = await this.getOrCreateCart(sessionId);
    await this.itemRepo.delete({ cartId: cart.id });
  }
}
