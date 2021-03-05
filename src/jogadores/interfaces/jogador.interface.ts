import { Document } from 'mongoose';

export interface Jogador extends Document{
    readonly _id: string;
    readonly telefone: string;
    readonly email: string;
    nome: string;
    ranking: string;
    posicao: number;
    urlFoto: string;
}