import { getAllTestimonials } from '../lib/repositories/testimonials';
import type { Testimonial } from '../lib/types';
import { useSWR, type SWRResult } from './useSWR';

export function useTestimonials(): SWRResult<Testimonial[]> {
  return useSWR<Testimonial[]>('testimonials', getAllTestimonials);
}
