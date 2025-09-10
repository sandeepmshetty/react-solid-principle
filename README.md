# 🏗️ Enterprise React TypeScript Workspace

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive demonstration of **SOLID principles**, **Clean Architecture**, **Domain-Driven
Design (DDD)**, and **enterprise-grade development standards** in a modern React TypeScript
application.

## 🎯 Project Overview

This workspace showcases advanced architectural patterns and development practices for building
scalable, maintainable enterprise applications. It implements a complete **Clean Architecture** with
**CQRS**, **Event Sourcing**, **Dependency Injection**, and comprehensive **code quality tooling**.

### 🌟 Key Features

- **🏗️ Clean Architecture** - Domain, Application, Infrastructure layers
- **⚡ CQRS Pattern** - Command Query Responsibility Segregation
- **🔄 Event Sourcing** - Domain events and event bus implementation
- **💉 Dependency Injection** - Modular IoC container system
- **🎯 SOLID Principles** - Complete implementation with practical examples
- **🧪 Comprehensive Testing** - Unit, Integration, and E2E testing strategies
- **📊 Code Quality Tools** - Advanced analysis and reporting
- **🚀 Modern Tooling** - TypeScript, ESLint, Prettier, Husky

## 📁 Project Structure

```
src/
├── 🏛️ domain/              # Enterprise Business Rules
│   ├── user/               # User domain aggregate
│   │   ├── entities.ts     # Domain entities and value objects
│   │   ├── events.ts       # Domain events
│   │   └── repository.ts   # Repository interfaces
│   └── auth/               # Authentication domain
├── 🎯 application/          # Application Business Rules
│   ├── commands/           # Write operations (CQRS)
│   ├── queries/            # Read operations (CQRS)
│   ├── services/           # Application services
│   ├── buses.ts            # Command/Query bus implementations
│   └── cqrs.ts             # CQRS base interfaces
├── 🔧 infrastructure/       # Frameworks & Drivers
│   ├── container/          # Dependency injection system
│   ├── persistence/        # Data access implementations
│   ├── events/             # Event bus implementation
│   ├── http/               # HTTP client abstractions
│   └── logging/            # Logging interfaces
├── 🎨 components/           # UI Layer
│   ├── ui/                 # Reusable UI components
│   ├── users/              # User-specific components
│   └── architecture/       # Architecture demonstration components
├── 🪝 hooks/                # Custom React Hooks
│   ├── form/               # Form management hooks
│   ├── state/              # State management hooks
│   ├── user/               # User-specific hooks
│   └── utils/              # Utility hooks
├── 🔗 services/             # Service layer
├── 🌐 providers/            # React context providers
├── 📝 types/                # Shared type definitions
└── 📱 app/                  # Next.js app router
```

## 🏛️ Architecture Principles

### Clean Architecture Layers

1. **Domain Layer** (`src/domain/`)
   - Pure business logic with no external dependencies
   - Entities, Value Objects, Domain Services
   - Repository interfaces (not implementations)

2. **Application Layer** (`src/application/`)
   - Use cases and application services
   - CQRS commands and queries
   - Orchestrates domain operations

3. **Infrastructure Layer** (`src/infrastructure/`)
   - External concerns (databases, APIs, frameworks)
   - Repository implementations
   - Dependency injection container

4. **UI Layer** (`src/components/`, `src/app/`)
   - React components and pages
   - Presentation logic only

### SOLID Principles Implementation

#### ✅ Single Responsibility Principle (SRP)

- [`UserEntity`](src/domain/user/entities.ts:5) - Only manages user business logic
- [`UserRepository`](src/domain/user/repository.ts) - Only handles user data persistence
- [`CreateUserCommand`](src/application/commands/user.commands.ts) - Only represents user creation
  intent

#### ✅ Open/Closed Principle (OCP)

- [`CommandHandler`](src/application/cqrs.ts:16) - New handlers can be added without modifying
  existing code
- [`Repository`](src/infrastructure/persistence/) - New storage backends without changing interfaces
- [`EventBus`](src/infrastructure/events/event-bus.ts) - Extensible through event registration

#### ✅ Liskov Substitution Principle (LSP)

- [`UserRepository`](src/infrastructure/persistence/user/) implementations are interchangeable
- [`Logger`](src/services/logger.ts) implementations work identically
- [`HttpClient`](src/services/http-client/) implementations follow same contract

#### ✅ Interface Segregation Principle (ISP)

- [`CommandBus`](src/application/cqrs.ts:27) vs [`QueryBus`](src/application/cqrs.ts:34) - Separate
  read and write operations
- Specific event handlers handle only relevant event types
- Focused command interfaces for single-purpose operations

#### ✅ Dependency Inversion Principle (DIP)

- Domain depends on abstractions (interfaces)
- Infrastructure implements abstractions (concrete classes)
- High-level modules don't depend on low-level details

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-solid-enterprise

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# 🔧 Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# 🧪 Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests with Playwright

# 🔍 Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# 📊 Analysis & Reporting
npm run complexity       # Generate complexity report
npm run complexity:html  # Generate and open HTML report
npm run analyze          # Bundle analysis
npm run audit            # Security audit
```

## 🧪 Testing Strategy

### Unit Tests

- **Domain Logic**: Test business rules in isolation
- **Application Services**: Test use case orchestration
- **Infrastructure**: Test external integrations

### Integration Tests

- **Command/Query Handlers**: Test complete workflows
- **Repository Implementations**: Test data access patterns
- **Event Bus**: Test event publishing and handling

### E2E Tests

- **User Workflows**: Test complete user journeys
- **API Integration**: Test external service integration
- **UI Components**: Test user interface interactions

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 📊 Code Quality & Analysis

### ESLint Configuration

- **TypeScript Rules**: Strict type checking
- **Complexity Limits**: Max complexity 10, max lines 300
- **Code Standards**: Consistent formatting and naming

### Complexity Analysis

```bash
# Generate comprehensive complexity report
npm run complexity:custom

# View interactive HTML dashboard
npm run complexity:html
```

### Bundle Analysis

```bash
# Analyze bundle size and dependencies
npm run build:analyze
```

## 🏗️ Design Patterns

### Command Query Responsibility Segregation (CQRS)

- **Commands**: Write operations that change state
- **Queries**: Read operations that return data
- **Handlers**: Process commands and queries separately
- **Buses**: Route operations to appropriate handlers

### Repository Pattern

- **Interface Segregation**: Separate read and write operations
- **Multiple Implementations**: HTTP, In-Memory, etc.
- **Specification Pattern**: Complex query logic

### Dependency Injection

- **IoC Container**: Manages object dependencies
- **Factory Functions**: Environment-specific configurations
- **Service Lifetime Management**: Singleton, Transient patterns

### Event Sourcing

- **Domain Events**: Record all changes to domain objects
- **Event Store**: Persist events for replay and audit
- **Event Publishers**: Notify other parts of the system

## 🔧 Configuration

### TypeScript Configuration

- **Strict Mode**: All strict type checking options enabled
- **Path Mapping**: Clean imports with `@/` aliases
- **Modern Target**: ES2020 with latest features

### ESLint Rules

- **Complexity**: Max 10 per function
- **File Size**: Max 300 lines per file
- **Function Size**: Max 50 lines per function
- **Parameters**: Max 5 parameters per function

### Git Hooks (Husky)

- **Pre-commit**: Lint and format staged files
- **Pre-push**: Run type checking and tests

## 📈 Performance Considerations

### CQRS Benefits

- **Read Models**: Optimized for specific query patterns
- **Write Models**: Optimized for business operations
- **Independent Scaling**: Scale reads and writes separately

### Event Sourcing Benefits

- **Audit Trail**: Complete history of all changes
- **Temporal Queries**: State at any point in time
- **Replay Capability**: Rebuild projections from events

### Caching Strategy

- **Domain Events**: Cache invalidation triggers
- **Query Results**: Cache read model data
- **Repository Pattern**: Transparent caching layer

## 🔒 Security Considerations

### Input Validation

- **Domain Level**: Business rule validation
- **Application Level**: Command validation
- **Infrastructure Level**: Data format validation

### Authorization

- **Command Level**: Permission checks before execution
- **Query Level**: Data filtering based on user context
- **Event Level**: Event publication permissions

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Learning Resources

### Architecture Patterns

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

### SOLID Principles

- [SOLID Principles Explained](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Dependency Inversion Principle](https://martinfowler.com/articles/dipInTheWild.html)

### Testing Strategies

- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow SOLID principles
- Write comprehensive tests
- Maintain high code coverage
- Use conventional commit messages
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clean Architecture** by Robert C. Martin
- **Domain-Driven Design** by Eric Evans
- **Enterprise Integration Patterns** by Gregor Hohpe
- **React** and **TypeScript** communities

---

**Built with ❤️ for enterprise-grade React applications**

For detailed architecture documentation, see
[`docs/MODULAR_ARCHITECTURE.md`](docs/MODULAR_ARCHITECTURE.md)

For code analysis and reporting, see [`docs/REPORTING.md`](docs/REPORTING.md)
