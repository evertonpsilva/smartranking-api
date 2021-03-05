import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador>{
        const {email} = criarJogadorDto;
        
        const jogadorExistente = await this.jogadorModel.findOne({email}).exec();

        if(jogadorExistente){
            throw new BadRequestException(`Email ${email} já cadastrado`);
        }

        const jogadorCriado = new this.jogadorModel(criarJogadorDto);

        try{
            return await jogadorCriado.save();
        }catch(erro){
            if(erro.code == 11000){
                throw new BadRequestException('Telefone já cadastrado anteriormente');
            }
            throw new BadRequestException('Ocorreu um erro. Verifique seus dados e tente novamente');
        }
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void>{
        const jogadorExistente = await this.jogadorModel.findOne({_id}).exec();

        if(!jogadorExistente){
            throw new NotFoundException("Jogador não encontrado");
        }
        await this.jogadorModel.findOneAndUpdate(
            {_id: _id}, 
            {$set: atualizarJogadorDto}
        ).exec();
    }

    async consultarTodosJogadores(): Promise<Jogador[]>{
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador>{

        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();
        if(!jogadorEncontrado){
            throw new NotFoundException("Jogador não encontrado");
        }
        return jogadorEncontrado;
    }

    async deletarJogador(_id: string): Promise<any>{

        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();
        if(!jogadorEncontrado){
            throw new NotFoundException("Jogador não encontrado");
        }

        return await this.jogadorModel.deleteOne({_id: _id}).exec();
    }

}
