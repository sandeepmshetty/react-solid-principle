// User Data Mappers
// Single Responsibility Principle - Only handles data transformation between domain and API

import { UserEntity } from '@/domain/user/entities';
import type { UserApiRequest, UserApiResponse } from './types';

export class UserMapper {
  static fromApiResponse(apiData: UserApiResponse): UserEntity {
    return UserEntity.create({
      id: apiData.id,
      email: apiData.email,
      name: apiData.name,
      role: apiData.role,
      createdAt: new Date(apiData.createdAt),
      updatedAt: new Date(apiData.updatedAt),
      isActive: apiData.isActive,
    });
  }

  static toApiRequest(user: UserEntity): UserApiRequest {
    const plainObject = user.toPlainObject();
    return {
      id: plainObject.id,
      email: plainObject.email,
      name: plainObject.name,
      role: plainObject.role,
      createdAt: plainObject.createdAt.toISOString(),
      updatedAt: plainObject.updatedAt.toISOString(),
      isActive: plainObject.isActive,
    };
  }

  static fromApiResponseArray(apiDataArray: UserApiResponse[]): UserEntity[] {
    return apiDataArray.map(apiData => this.fromApiResponse(apiData));
  }
}
