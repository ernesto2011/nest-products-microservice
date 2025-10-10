# Products Microservice

A NestJS-based microservice for managing products using TCP transport and Prisma ORM with SQLite database.

## Features

- **Product Management**: Full CRUD operations for products
- **Microservice Architecture**: TCP-based communication using NestJS microservices
- **Database**: SQLite with Prisma ORM
- **Validation**: Input validation using class-validator and class-transformer
- **Pagination**: Built-in pagination support
- **Environment Configuration**: Joi-based environment validation

## Tech Stack

- **Framework**: NestJS 11.x
- **Database**: SQLite with Prisma ORM
- **Transport**: TCP Microservice
- **Validation**: class-validator, class-transformer, Joi
- **Package Manager**: pnpm

## Project Structure

```
src/
├── common/
│   └── dto/
│       └── pagination.dto.ts
├── config/
│   └── envs.ts
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── app.module.ts
└── main.ts
```

## Installation

```bash
# Install dependencies
pnpm install

# Setup database
npx prisma generate
npx prisma db push
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
```

## Available Commands

```bash
# Development
pnpm run start:dev

# Production
pnpm run build
pnpm run start:prod

# Database
npx prisma studio          # Open Prisma Studio
npx prisma db push         # Push schema changes
npx prisma generate        # Generate Prisma client

# Testing
pnpm run test              # Unit tests
pnpm run test:e2e          # End-to-end tests
pnpm run test:cov          # Test coverage

# Code Quality
pnpm run lint              # ESLint
pnpm run format            # Prettier
```

## Microservice API

The service communicates via TCP transport using message patterns:

### Available Message Patterns

| Pattern | Description | Payload |
|---------|-------------|----------|
| `create_product` | Create a new product | `CreateProductDto` |
| `find_all_products` | Get all products with pagination | `PaginationDto` |
| `find_one_product` | Get product by ID | `{ id: number }` |
| `update_product` | Update existing product | `UpdateProductDto` |
| `remove_product` | Delete product by ID | `{ id: number }` |

### Product Schema

```typescript
{
  id: number;          // Auto-increment primary key
  name: string;        // Product name
  price: number;       // Product price
  available: boolean;  // Availability status (default: true)
  createdAt: Date;     // Creation timestamp
  updatedAt: Date;     // Last update timestamp
}
```

## Usage Example

To communicate with this microservice from another NestJS application:

```typescript
// In your client service
@Injectable()
export class ClientService {
  constructor(
    @Inject('PRODUCTS_SERVICE') 
    private readonly productsClient: ClientProxy
  ) {}

  async createProduct(productData: CreateProductDto) {
    return this.productsClient.send(
      { cmd: 'create_product' }, 
      productData
    );
  }

  async getProducts(pagination: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find_all_products' }, 
      pagination
    );
  }
}
```

## Development

1. Start the microservice in development mode:
   ```bash
   pnpm run start:dev
   ```

2. The service will be available on the configured TCP port (default: 3001)

3. Use Prisma Studio to inspect the database:
   ```bash
   npx prisma studio
   ```

## License

This project is licensed under the UNLICENSED license.
