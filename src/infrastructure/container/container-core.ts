// Core Container Implementation
// Single Responsibility Principle - Only handles service registration and resolution
// Open/Closed Principle - Extensible through binding configuration

export interface Container {
  bind<T>(identifier: ServiceType): Binding<T>;
  get<T>(identifier: ServiceType): T;
  has(identifier: ServiceType): boolean;
  getAllBindings(): Map<ServiceType, ContainerBinding>;
  clear(): void;
  listServices(): string[];
}

export interface Binding<T> {
  to(implementation: new (...args: unknown[]) => T): void;
  toValue(value: T): void;
  toFactory(factory: () => T): void;
  toSingleton(implementation: new (...args: unknown[]) => T): void;
}

export type ServiceType = symbol | string;

export interface ContainerBinding {
  type: 'constructor' | 'value' | 'factory' | 'singleton';
  value: unknown;
  isSingleton: boolean;
}

/**
 * Lightweight Dependency Injection Container
 * Follows SOLID principles with minimal complexity
 */
export class ModularContainer implements Container {
  private readonly bindings = new Map<ServiceType, ContainerBinding>();
  private readonly instances = new Map<ServiceType, unknown>();

  bind<T>(identifier: ServiceType): Binding<T> {
    return {
      to: (implementation: new (...args: unknown[]) => T) => {
        this.bindings.set(identifier, {
          type: 'constructor',
          value: implementation,
          isSingleton: false,
        });
      },
      toValue: (value: T) => {
        this.bindings.set(identifier, {
          type: 'value',
          value,
          isSingleton: true,
        });
      },
      toFactory: (factory: () => T) => {
        this.bindings.set(identifier, {
          type: 'factory',
          value: factory,
          isSingleton: false,
        });
      },
      toSingleton: (implementation: new (...args: unknown[]) => T) => {
        this.bindings.set(identifier, {
          type: 'singleton',
          value: implementation,
          isSingleton: true,
        });
      },
    };
  }

  get<T>(identifier: ServiceType): T {
    // Check if singleton instance exists
    if (this.instances.has(identifier)) {
      return this.instances.get(identifier) as T;
    }

    const binding = this.bindings.get(identifier);
    if (!binding) {
      throw new Error(
        `No binding found for identifier: ${identifier.toString()}`
      );
    }

    let instance: T;

    switch (binding.type) {
      case 'value':
        instance = binding.value as T;
        break;
      case 'factory':
        instance = (binding.value as () => T)();
        break;
      case 'constructor':
      case 'singleton':
        instance = new (binding.value as new (...args: unknown[]) => T)();
        break;
      default:
        throw new Error(
          `Unknown binding type for identifier: ${identifier.toString()}`
        );
    }

    // Store singleton instances
    if (binding.isSingleton) {
      this.instances.set(identifier, instance);
    }

    return instance;
  }

  has(identifier: ServiceType): boolean {
    return this.bindings.has(identifier);
  }

  getAllBindings(): Map<ServiceType, ContainerBinding> {
    return new Map(this.bindings);
  }

  clear(): void {
    this.bindings.clear();
    this.instances.clear();
  }

  listServices(): string[] {
    return Array.from(this.bindings.keys()).map(key => key.toString());
  }
}
