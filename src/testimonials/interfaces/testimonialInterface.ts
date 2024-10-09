// src/services/interfaces/testimonial.interface.ts

export interface TestimonialInterface {
    status: 'active' | 'inactive';
    fullName: string;
    description: string;
    image: string;
}
