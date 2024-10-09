// src/services/interfaces/blog.interface.ts

export interface BlogInterface {
    status?: string;
    title: string;
    author: string;
    description: string;
    image: string;
    createdAt?: Date;
}
