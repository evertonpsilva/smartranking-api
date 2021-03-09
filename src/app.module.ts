import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DB_KEY } from 'db-key';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      DB_KEY,
      {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false},
    ), 
    CategoriasModule,
    JogadoresModule,
    DesafiosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
