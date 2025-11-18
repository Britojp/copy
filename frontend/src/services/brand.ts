import { get, post, put, del } from './http';
import { type BrandProfile, type CreateBrandProfileRequest, type UpdateBrandProfileRequest } from '../types/brand';

export function listBrandProfiles(): Promise<BrandProfile[]> {
  return get<BrandProfile[]>('ai/brand-profiles');
}

export function getBrandProfile(id: string): Promise<BrandProfile> {
  return get<BrandProfile>(`ai/brand-profiles/${id}`);
}

export function createBrandProfile(data: CreateBrandProfileRequest): Promise<BrandProfile> {
  return post<BrandProfile>('ai/brand-profiles', data);
}

export function updateBrandProfile(id: string, data: UpdateBrandProfileRequest): Promise<BrandProfile> {
  return put<BrandProfile>(`ai/brand-profiles/${id}`, data);
}

export function deleteBrandProfile(id: string): Promise<void> {
  return del<void>(`ai/brand-profiles/${id}`);
}

