const express = require('express'); //importa o express dentro da variável express

//importa o cors
const cors = require('cors');

//importa a função uuid que vai criar um id único universal
//isUuid pode ser usada para passar uma string e vai retornar se é um id válido ou não
const { uuid, isUuid } = require('uuidv4');

const app = express(); //cria a aplicação

//Inserir logo após criar o app. 
//Configurado desta maneira permite que qualquer frontend tenha acesso ao nosso backend
app.use(cors());

//use é utilizado para adicionar algum tipo de função que todas as rotas terão que passar por ela
//Neste caso a função é express.json()
//Isto deve vir antes das rotas, logo depois de definir a variável app
app.use(express.json());

// '/projects' -> endereço que queremos observar. Não é obrigatório inserir nenhum endereço. Pode ser apenas '/'
// response -> devolve uma resposta para o front-end
// send -> permite retornar um texto

const projects = [];

function logRequests(request, response, next) {
    //busca o método chamado (GET, POST, PUT, DELETE) e a rota
    const { method, url } = request;

    //converte o method em caixa alta
    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);
    //se não chamar a função 'next' no final do middleware, o próximo middleware,
    //que no caso é uma rota, não vai ser disparada
    next(); //Próximo middleware

    console.timeEnd(logLabel);
}

//middleware para validação do id passado como parâmetro na rota do método PUT
function validadeProjectId(request, response, next) {
    const { id } = request.params;

    //se o id não for válido retorna um status de erro
    //dentro do middleware, todo vez que faz um return (um return response, não next), é um
    //middleware que vai interromper totalmente a requisição
    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID' })
    }

    //se o id for inválido o próximo passo nunca será executado, mesmo que tenha este return next();
    //se o id for válido chama o next e a rota acontece
    return next();
}

app.use(logRequests);
//aplica o middleware validadeProjectId apenas nas rotas que tem o formato '/projects/:id'
//que são as rotas PUT e DELETE
//Aqui poderiam ser anexados quantos middlewares forem necessários
app.use('/projects/:id', validadeProjectId);

//o que vem logo depois da barra é um recurso. (projects)
//logRequests é um middleware inserido na rota. É possível inserir quantos middlewares forem necessários.
//Eles serão executados em sequência pelo Express 
app.get('/projects', (request, response) => {
    //recupera o título de dentro dos query params
    const { title } = request.query;

    //se o título foi preenchido pelo usuário, a constante results será
    //preenchida com o filtro de projetos em que para cada um dos projetos 
    //vai verificar se no título de projeto inclui a palavra que está dentro de title
    //o método includes retorna um true ou false
    //se o title for vazio, os results serão todos os projetos
    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    //json sempre deve ser retornado ou um array, ou um objeto
    return response.json(results);
});

//o nome do recurso usado em GET pode ser o mesmo para POST
//as rotas precisam ser únicas tanto em endereço (recurso) + o método utilizado
app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner } //project vai receber o objeto que contém title e owner e o id será gerado automaticamente

    projects.push(project);//insere o projeto no array projects

    return response.json(project);//exibe o projeto recém criado
});

//sempre que for utilizar uma rota do tipo PUT é necessário informar qual projeto estou
//querendo alterar, geralmente informado por um id. Dois pontos indica que vem um parâmetro de rota.
//Exemplo: http://localhost:3333/projects/2 -> atualiza o projeto que possui id = 2
app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body; //usado para pegar os dados do projeto atualizado

    //percorre o array de projetos e procura a posição(índice) de um projeto que contenha 
    //o id igual ao id recebido como parâmetro da rota
    const projectIndex = projects.findIndex(project => project.id === id);

    //se não encontrar o índice, ou seja, -1 (menor que 0) 
    //retorna uma mensagem de erro
    if (projectIndex < 0) {
        //seta o status para 400, queé um código genérico para algum erro que ocorrer no back-end
        //se isso não for feito, ele retornará status 200, que significa que a requisição foi bem sucedida
        return response.status(400).json({ error: 'Project nor found.' })
    }

    //pega os dados do projeto atualizado de dentro do body
    const project = {
        id,
        title,
        owner,
    };

    //dentro do array de projetos, vai procurar na posição [projectIndex] 
    //e substitui o valor aramazenado nesta posição pelo valor armazenado em project 
    projects[projectIndex] = project;

    //retorna o projeto atualizado
    return response.json(project);
});

//para DELETE, novamente é necessário passar um parâmetro id para a rota
app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    //percorre o array de projetos e procura a posição(índice) de um projeto que contenha 
    //o id igual ao id recebido como parâmetro da rota
    const projectIndex = projects.findIndex(project => project.id === id);

    //se não encontrar o índice, ou seja, -1 (menor que 0) 
    //retorna uma mensagem de erro
    if (projectIndex < 0) {
        //seta o status para 400, queé um código genérico para algum erro que ocorrer no back-end
        //se isso não for feito, ele retornará status 200, que significa que a requisição foi bem sucedida
        return response.status(400).json({ error: 'Project nor found.' })
    }

    //splice é um método para retirar alguma informação de dentro de um array
    //passa como parâmetro o índice que quer remover e quantas posições quer remover a partir deste índice 
    //no caso, apenas a informação contida neste índice (1)
    projects.splice(projectIndex, 1)

    //retorna apenas uma resposta em branco, pois está fazendo uma remoção
    //quando é uma resposta vazia, é recomendado enviar com o código de status 204
    return response.status(204).send();
})
//o segundo parâmetro é uma função que é disparada automaticamente quando o servidor for colocado no ar
app.listen(3333, () => {
    console.log('Back-end started')
}); //configura a porta