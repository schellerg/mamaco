# Teste front-end Gorila

## Instalação
```bash
$ npm install
```

## API
Você pode conferir os endpoints da aplicação neste [link](https://documenter.getpostman.com/view/14696473/TWDamvPN).

## Banco de Dados
Rode o comando abaixo para inicializar um banco de dados MySQL no Docker:  
```bash
$ docker run --name gorila -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

Usando a linha de comando ou um cliente de MySQL, importe o arquivo [db.sql](/sql/db.sql)