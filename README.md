# Teste front-end Gorila

## Instalação
### Back-end
Entre na pasta [back](/back) e execute o comando:
```bash
$ npm install
```

Caso precise editar a porta e o _JWT secret_ da API, altere as constantes `PORT` e `JWT_SECRET` no arquivo [index.js](/back/index.js).

Para inicializar a API, rode o comando abaixo:
```bash
$ npm start
```

### Front-end
Entre na pasta [back](/front-novo) e execute o comando:
```bash
$ npm install
```

Execute o comando abaixo dentro do diretório para iniciar a aplicação:
```bash
$ npm start
```

Caso precise editar a porta e o host da API, altere o arquivo [Api.js](/front-novo/src/Api.js).

## API
Você pode conferir os endpoints da aplicação neste [link](https://documenter.getpostman.com/view/14696473/TWDamvPN).

## Banco de Dados
Rode o comando abaixo para inicializar um banco de dados MySQL no Docker:  
```bash
$ docker run --name gorila -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

Usando a linha de comando ou um cliente de MySQL, importe o arquivo [db.sql](/sql/db.sql)