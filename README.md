# Prisma APi NestJs

## Criação do projeto Nestjs

> Necessário ter o <a href="https://nodejs.org/en/" target="_blank">Node</a> instalado
> Assim como também o <a href="https://www.docker.com/" target="_blank">Docker</a> e o <a href="https://docs.docker.com/compose/" target="_blank">Docker Compose</a>

* Para isso e necessário ter a CLI do <a href="https://docs.nestjs.com/" target="_blank">Nestjs</a>, para isso pode fazer acessando seu site.

```bash
# instalação da CLI do nestjs
npm i -g @nestjs/cli

# Criação do projeto
nest new project-name
```
> Usando o `npm` como gerenciador de pacote

## Instalação de depedências

Acessando a pasta do projeto criando executar o seguinte comando

```bash
npm i -D @nestjs/core @nestjs/common rxjs reflect-metadata @nestjs/config
```

## Configuração do estilo

* Criar um arquivo na raiz do projeto `.eslintignore`

```bash
node_modules
dist
build
/**/*.js
```
*
* Criar um arquivo na raiz do projeto `.prettierignore`

```bash
node_modules
dist
build
/**/*.js
```

* E no arquivo `.prettierc`

```bash
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

* Criar um arquivo `.editorconfig`

```bash
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

# Configuração do Docker

## Dockerfile

Na raiz do projeto criar um arquivo `Dockerfile`

> O Dockerfile e responsável para que o proejto rode em um container do Docker

```bash
FROM node:lts-alpine

RUN apk add --no-cache bash

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app
```

## Entrypoint

* Criação do entypoint

Na raiz do projeto criar uma pasta `.docker` e dentro dela um arquivo `entrypoint`

> Antes de excecutar o projeto excluir a pasta `node_modules` pois será criado dentro do `Docker`

```bash
#!/bin/bash

npm install
npm run build
npm run start:dev
```

* Após isso dar as permissões necessárias com o comando

```bash
chmod +x .docker/entrypoint.sh
````

## Dockerfile para o Postgres

Dentro ainda da pasta `.docker`criar uma pasta `Postgres` e dentro dele um arquivo `Dockerfile`

```bash
FROM postgres

RUN usermod -u 1000 postgres
```

## Docker Compose

Na raiz do projeto criar um arquivo `docker-compose.yml`

```bash
version: '3'

services:
  app:
    build: .
    entrypoint: .docker/entrypoint.sh
    container_name: prisma-api-app
    ports:
      - "3000:3000"
    volumes:
      - .:/home/node/app
    depends_on:
      - db

  db:
    build: .docker/postgres
    container_name: prisma-api-db
    restart: always
    tty: true
    ports:
      - "5432:5432"
    volumes:
      - .docker/dbdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=prismaapi
```

### Alteração do tsconfig

```bahs
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  },
  "include": ["src"],
  "exclude": [
    "node_modules",
    "build",
    "dist",
    ".docker"
    ]
}
```

* Excluir a pasta `node_modules` execultar o comando

```bash
rm -rf node_modules
```
* Subir o `docker-compose` executar o comando

```bash
docker-compose up
```

# Prisma

## Instalar a CLI do Prisma

Como o projeto está sendo executado com o `Docker Compose` é necessário fazer o processo de instalação da CLI do Prisma dentro do container do Docker.
Para isso temos que acessa o `bash` com o comando

```bash
# subir o docker-compose
docker-compose up -d

# acessa o bash dentro do app
docker-compose exec app bash

# Dentro do container instalar a CLI
npm i -prisma -D

# Inicializar o Prisma
npx prisma init
```

> Todos os comandos que forem necessário executar terá que ser dentro do `bash` do `docker-compose`

## Executando o Migration

Estando dentro do `bash` do `docker-compose` executar o comando

```bash
npx prisma migrate dev --name init
```

### Criando o Service do Prisma

```bash
nest g service prisma
```

Dentro do arquivo `prisma.service` deixar essa configuração

```bash
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```
### Prisma Studio

Para usar o serviço de banco de dados do Prisma, é necessário dentro do `docker-compose.yml` configura sua porta

```bash
    ports:
      - "5432:5432"
      - "5555:5555"
```

Após isso distruir o container e subi novamente

```bash
# Sair do bash do container
exit

# para o docker-compose
docker-compose stop

# remvendo os containers
docker-compose down

# subindo novamente
docker-compose up

# abrir o bash
docker-compose exec app bash

# Dentro do container - prisma studio
npx prisma studio
```

# Criando o modulo de User

> Todos os comandos usandos agora tem que ser dentro do container do Docker Compose
> Para acessa ele é necessário execuntar o comando `docker-compose exec app bash` com o Docker Compose em execução

## Criando o CRUD de User

```bash
nest g res users
```

## Valitações

```bash
npm install class-validator class-transformer
```






