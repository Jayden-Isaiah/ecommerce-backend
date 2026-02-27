import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    private readonly productsService: ProductsService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    let total = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}`,
        );
      }
      const unitPrice = Number(product.price);
      total += unitPrice * item.quantity;
      orderItems.push({ productId: product.id, quantity: item.quantity, unitPrice });
    }

    const order = this.orderRepo.create({
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      shippingAddress: dto.shippingAddress,
      total,
      items: orderItems as OrderItem[],
    });

    return this.orderRepo.save(order);
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order> {
    await this.findOne(id);
    await this.orderRepo.update(id, { status: dto.status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.orderRepo.delete(id);
  }
}
