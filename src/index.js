const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

const users = [];

app.use(cors());
app.use(express.json());

// const users = [];


/////////////////MIDDLEWARE////////////////////////////////////////////////
function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  const user = users.find((user) => user.username === username);
  if(!user){
    return response.status(400).json({ error: "User not found"});
  }
  
  request.user = user; //para repassar a informação que está sendo consumida dentro do middleware par as demais rotas
  return next();

};

/**
   * id: 'uuid', // precisa ser um uuid
	   name: 'Danilo Vieira', 
	   username: 'danilo', 
	   todos: []
   */

 //////////////////////////////////CADASTRO USUARIO/////////////////////////////////////////////////////////    
app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  const id = uuidv4();

  const userExists = users.find(user => user.username ===username);
  if(userExists){
    return response.status(400).json({error:'Username already exists'})
  }

  /*users.push({
    id,
    name,
    username,
    todos: []
  });*/

  const user = {
    id,
    name,
    username,
    todos: []
  }

  users.push(user);

  /*return response.status(201).send();*/
  return response.status(201).json(user);
});


///////////LISTAR TODOS//////////////////////////////////////////////////////////////////////////////////////////
app.get('/todos/', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request; //com isso tem acesso ao customer que foi verificado a existencia no middleware
  return response.json(user.todos);
});

///////////////////ADD UM NOVO TODO///////////////////////////////////////////////////////////////////////////////////////
app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const {user} = request;

  const toDo = {
    id: uuidv4(),
    title,
    deadline:new Date(deadline),
    done: false,
    created_at:new Date()

  }

  user.todos.push(toDo);
  //return response.status(201).send(); PODE SER FEITO COM O SEND AO INVES DE JSON?
  return response.status(201).json(user);

  /*id: 'uuid', // precisa ser um uuid
	title: 'Nome da tarefa',
	done: false, 
	deadline: '2021-02-27T00:00:00.000Z', 
	created_at: */
});


///////////ATUALIZAR UM TODO///////////////////////////////////////////////////////////////////////////////////////////////
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;
  const todo = user.todos.find(todo => todo.id ===id);
 
  if(!todo){
    return response.status(404).json({ error: "To do doesn't exist"});
  }
  todo.title = title;
  todo.deadline=new Date(deadline);
  
  return response.json(todo);
});

//////////////////////MARCAR TODO COMO FEITO////////////////////////////////////////////////////////
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;
  const {done} = request.body; //ñ precisa disso?
  const todo = user.todos.find(todo => todo.id ===id);
  if(!todo){
    return response.status(404).json({ error: "To do doesn't exist"});
  }

  todo.done = true;
 
  return response.json(todo);

});

/////////////////////DELETAR UM TODO//////////////////////////////////////////////////////////////////////////////
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id); //retorna a posição no array do objeto, caso existe, se n existir retorna -1
  if (todoIndex === -1){
    return response.status(404).json({error: "TO do not found"})
  }

  user.todos.splice(todoIndex,1); //recebe posiãoõ inicial de onde sera excluido (posição encontrad do todoIndex) e quantos elementos serao excluidos(1)


});

module.exports = app;