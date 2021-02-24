# Instalação

## Banco de Dados
Rode o comando abaixo para inicializar um banco de dados MySQL no Docker:  
`docker run --name gorila -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql`

Usando a linha de comando ou um cliente de MySQL, importe o arquivo banco.sql

# Documentação

https://www.npmjs.com/package/mysql2