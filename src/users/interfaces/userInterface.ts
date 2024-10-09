// src/services/interfaces/user.interface.ts

export interface UserInterface {
    status: 'active' | 'inactive';
    fullname: string;
    role: string;
    email: string;
    image: string;
    phoneNumber: string;
    twitter?: string; // Optional property
    instagram?: string; // Optional property
    linkedin?: string; // Optional property
}
