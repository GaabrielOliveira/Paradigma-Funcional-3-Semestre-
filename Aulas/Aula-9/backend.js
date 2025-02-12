const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');


const porta = 3000;
const app = express();
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ifms',
    database: 'tads'
});

app.use(express.json());

//post salvar no banco
app.post('/api/dados', (req, res) => {

    const dados = req.body;
    
    try
    {
        if(!dados.nome||typeof dados.nome !== 'string' || dados.nome.trim() ===''){
            throw new Error('Nome invalido');
        }
        if(!dados.idade || typeof dados.idade !== 'number'|| !Number.isInteger(dados.idade) || dados.idade < 0){
            throw new Error('Idade invalida');
        }
        if(!dados.profissao||typeof dados.profissao!=='string' || dados.profissao.trim() ===''){
            throw new Error('Profissao invalida');
        }
    
    
    connection.query(
        'INSERT INTO pessoa (nome, idade, profissao) VALUES (?,?,?)',
        [dados.nome, dados.idade,dados.profissao],
        (error, results) => {
            if(error) {
                console.error('Error ao inserir no banco' + error.stack);
                res.status(500).json({message: 'Error'});
                return;
            }
            res.json({
                message: 'Inserido com sucesso',
                dados:dados,
                resultadoBanco:results
            });
        }
    );
    
    }catch(error) {
        //retorno em caso de erro na validação
        res.status(400).json({error: error.message});
    }

});

//endpoint para buscar dados do banco de dados
app.get('/api/getdados',(req, res) => {
    //realiza uma consulta ao banco
    connection.query('select * from pessoa', (error, results) => {
        if(error){
            console.error('erro ao consultar dados: '+ error.stack);
            res.status(500).json({message: 'Error'});
            return;
        }
        res.json({message: 'Inserido com sucesso',
            dados:results
        }); });});
app.listen(porta,() => {console.log(`servidor em execução:http://localhost:${porta}`);});