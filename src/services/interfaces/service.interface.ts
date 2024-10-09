// src/services/interfaces/service.interface.ts

export interface ServiceInterface {
    id?: string;
    title: string;
    description: string;
    image: string;
    price: number;
    status?: string;
}
