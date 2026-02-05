import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("ProductsService");
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalRegisters = await this.product.count({where: { available: true }});
    const lastPage = Math.ceil(totalRegisters / limit!);
    if(page! > lastPage) {
      return {
        data: [],
        message: 'No more records',
      }
    }
    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: (page! - 1) * limit!,
        take: limit
      }),
      totalRegisters,
      currentPage: page,
      lastPage

    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true }
    });
    if(!product) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Product with id ${id} not found`
      });
    }
    return product;
  }
  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: data
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.product.update({
      where: { id },
      data: { available: false }
    })
  }

  async validateProducts( ids:number[]){
    ids= Array.from(new Set(ids));
    const products = await this.product.findMany({
      where:{
        id: {
          in: ids
        }
      }
    })

    if(products.length !== ids.length){
      throw new RpcException({
        message:'Some Products were not found',
        status: HttpStatus.BAD_REQUEST
      })
    }

    return products;
  }
}
