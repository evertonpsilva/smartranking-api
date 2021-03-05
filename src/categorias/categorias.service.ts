import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService,
    ){
        
    }

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria>{

        const { categoria } = criarCategoriaDto;

        const categoriaExistente = await this.categoriaModel.findOne({categoria}).exec();

        if(categoriaExistente){
            throw new BadRequestException("Categoria já cadastrada");
        }

        const categoriaCriada = new this.categoriaModel(criarCategoriaDto);

        return await categoriaCriada.save();
    }

    async consultarTodasCategorias(): Promise<Array<Categoria>>{
        return this.categoriaModel.find().populate("jogadores").exec();
    }

    async consultarCategoriaPeloNome(categoria: string): Promise<Categoria>{

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).populate("jogadores").exec();
        
        if(!categoriaEncontrada){
            throw new NotFoundException("Categoria não encontrada");
        }

        return categoriaEncontrada;
    }

    async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto){

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

        if(!categoriaEncontrada){
            throw new NotFoundException("Categoria não encontrada");
        }

        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: atualizarCategoriaDto}).exec();

    }

    async atribuirJogadorCategoria(params: string[]): Promise<void>{
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();
                                                
        if(!categoriaEncontrada){
            throw new NotFoundException("Categoria não encontrada");
        }

        const jogadorJaPertence = await this.categoriaModel
                                        .find({categoria})
                                        .where('jogadores')
                                        .in(idJogador).exec();
        if(jogadorJaPertence.length > 0){
            throw new BadRequestException("Jogador já cadastrado na categoria");
        }

        categoriaEncontrada.jogadores.push(idJogador);
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontrada}).exec();

    }

}
