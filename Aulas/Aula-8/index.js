//Caso nao tenha o express, instalar: npm install express
const express = require('express');

//Cria um servidor web
const app = express();

//Define a porta da aplicação
const porta = 3030;

//Express.json() explana sobre a possibilidade de reaçizar a conversao de dados JSON em um objeto JavaScript
app.use(express.json());

//Endpoint = URL utilizada para chamar o método
app.post('/api/dados',(req, res) => {
    try {
        const dados = req.body;
        if(!dados.nome || dados.nome.trim() ==='') {
            throw new Error('O campo "nome" é obrigatório e não pode estar vazio!');
        }
            res.json({message: 'Dados recebidos com sucesso!', dados:dados})
        }
     catch (error){
        res.status(400).json({message: 'Erro ao processar a requisição', error:error.message})
    }}
);
// Retorna os dados recebidos como resposta
app.listen(porta, () => {
    console.log(`Servidor em execução:http://localhost:${porta}`);
});