import { Document } from "mongoose";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";
import { DesafioStatus } from "../enums/desafio-status.enum";

export interface Desafio extends Document{

    dataHoraDesafio: Date;
    dataHoraSolicitacao: Date;
    dataHoraResposta: Date;
    solicitante: Jogador;
    categoria: string;
    jogadores: Array<Jogador>;
    partida: Partida;
    status: DesafioStatus;

}

export interface Partida extends Document{
    categoria: string;
    jogadores: Array<Jogador>;
    def: Jogador;
    resultado: Array<Resultado>
}

export interface Resultado{
    set: string;
}