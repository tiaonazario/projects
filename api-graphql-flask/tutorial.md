## Crie uma API GraphQL com Python, Flask e Ariadne

Você provavelmente já se deparou com o termo [GraphQL](https://graphql.org/) , mas você sabe o que é? Fique tranquilo (trocadilho não intencional), pois você aprenderá sobre isso em breve.

GraphQL é uma linguagem de consulta para APIs e um runtime do lado do servidor que permite que os clientes solicitem apenas os dados de que precisam das APIs. O GraphQL pretende ser uma alternativa mais eficiente e flexível ao [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) .

O GraphQL foi desenvolvido e usado internamente no Facebook e foi de código aberto em 2015. Desde então, ganhou popularidade com mais e mais desenvolvedores e empresas entrando na onda do GraphQL, construindo ferramentas de suporte e APIs do GraphQL. Uma das mais populares é a [API do Github GraphQL](https://docs.github.com/en/free-pro-team@latest/graphql) . GraphQL é agnóstico de linguagem, o que significa que podemos construir APIs GraphQL em Python, JavaScript, Java, Scala e muitas outras linguagens de programação.

### GraphQL vs. REST

Com REST, modelamos nossa API como recursos, fornecemos endpoints para acessar recursos específicos e definimos quais métodos HTTP são permitidos em um determinado endpoint.

Com o GraphQL, modelamos nossa API como um [gráfico](https://www.educative.io/edpresso/what-is-a-graph-data-structure) , com os tipos definidos no esquema sendo os nós. Nossos clientes fazem consultas a um único endpoint para obter dados nos “nós” específicos.

Por exemplo, uma `Todo`API REST exporia um endpoint como _/api/todos/<id>_ onde `id`é o id do `Todo`item no banco de dados. O endpoint suportaria os métodos `GET`, `PUT`, `DELETE`e `PATCH`permitiria buscar e manipular um item. Também teríamos outro endpoint para buscar todos os itens e criar novos, talvez _/api/todos_ .

Uma `Todo`API GraphQL, por outro lado, exporia um endpoint como / _api/graphql_ e os clientes enviariam consultas diferentes para esse endpoint para obter o que desejam. Uma consulta para buscar todos os todos ficaria assim:

```
query {
  todos {
    id
    description
    completed
    dueDate
  }
}
```

Uma consulta para buscar um único todo com um id de 2 ficaria assim:

```
query {
  todo(todoId: "2") {
    id
    description
    completed
    dueDate
  }
}
```

A consulta acima diz ao servidor para retornar os campos , , e de um `id`item `description`com `completed`2\. Se o cliente estivesse interessado apenas no e , a consulta diria da seguinte forma:`dueDate``Todo``id``id``description`

```
query {
  todo(todoId: "2") {
    id
    description
  }
}
```

Viu quanta flexibilidade o cliente tem em solicitar apenas os dados de que precisa?

Se você está curioso sobre o GraphQL, mas ainda não colocou a mão na massa construindo um servidor GraphQL em Python, não se preocupe. Ao final deste tutorial, você terá uma API [GraphQL](https://graphql.org/) usando [Flask](https://flask.palletsprojects.com/) e [Ariadne](https://ariadnegraphql.org/) . Nossa API nos ajudará a gerenciar listas de tarefas e será capaz do seguinte:

-   Criar novos itens
-   Listar todos os itens
-   Marcar um item como concluído
-   Alterar a data de vencimento de um item
-   Excluir um item

Você pode encontrar o código completo para o tutorial [aqui](https://github.com/alexkiura/todo-api-graphql) .

## Requisitos

O único requisito necessário para concluir este tutorial é o Python 3.6 ou superior. Se você não tiver instalado, obtenha-o [aqui](https://www.python.org/downloads/) .

## Criar um ambiente virtual Python

Vamos instalar vários pacotes Python para nosso projeto. Um ambiente virtual será útil, pois nos dará um ambiente Python isolado para nosso projeto. Vamos em frente e criar um.

Crie um diretório chamado _todo\_api_ e navegue até ele.

```
mkdir todo_api
cd todo_api
```

Crie o ambiente virtual:

```
python3 -m venv todo_api_env`
```

Se estiver usando um computador Mac ou Unix, ative o ambiente virtual da seguinte forma:

```
source todo_api_env/bin/activate
```

Para ativar o ambiente virtual no Windows, use o seguinte comando:

```
todo_api_env\Scripts\activate.bat
```

Agora vamos instalar os pacotes abaixo:

-   [Flask](https://flask.palletsprojects.com/en/1.1.x/) : Um framework simples para construir servidores web em Python
-   [Ariadne](https://ariadnegraphql.org/) : Uma biblioteca para usar aplicativos GraphQL
-   [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) : Uma extensão para Flask que facilita o uso de SQLAlchemy (um ORM) em um aplicativo Flask. SQLAlchemy nos permite interagir com bancos de dados SQL usando Python.

Vamos em frente e instalá-los:

```
pip install flask ariadne flask-sqlalchemy
```

## Introdução ao GraphQL

GraphQL é uma linguagem de consulta para APIs e um runtime do lado do servidor que permite que os clientes solicitem apenas os dados de que precisam. Construímos um serviço GraphQL: definindo os tipos de dados e operações permitidas nesses dados (esquema) e funções para os campos nos tipos de dados.

O GraphQL tem sua própria linguagem, a GraphQL Schema Definition Language (SDL), que é usada para escrever esquemas do GraphQL.

Podemos definir um `Todo`tipo usando o SDL da seguinte forma:

```
type Todo {
    id: ID!
    description: String!
    completed: Boolean!
    dueDate: String!
}
```

O `!`tipo depois de um indica que o campo não é anulável, ou em outras palavras, que deve sempre ter um valor.

### Buscando dados

Ao trabalhar com REST, geralmente buscamos dados fazendo solicitações HTTP GET para vários endpoints. O GraphQL funciona um pouco diferente. Temos um único endpoint, de onde o cliente pode solicitar todos os dados de que precisa. O cliente faz isso postando uma _consulta_ .

Uma consulta para obter todos os `Todo`itens pode ter a seguinte aparência:

```
type Query {
    todos: [Todo]!
}
```

### Criando e modificando dados

A maioria dos aplicativos também precisa de uma maneira de modificar os dados. Criamos, atualizamos e excluímos dados no GraphQL usando _mutações_ . Escrevemos mutações semelhantes a como escrevemos consultas, mas usamos a palavra-chave `mutation`_._ Uma mutação para criar um `Todo`seria assim:

```
 type Mutation {
    createTodo(description: String!, dueDate: String!): Todo!
}
```

Essa mutação aceita duas strings: uma descrição e uma data de vencimento e retorna um objeto Todo.

Saiba mais sobre consultas e mutações [aqui](https://graphql.org/learn/queries/) .

## Escrevendo nosso esquema GraphQL

Agora que estamos mais familiarizados com o GraphQL SDL, vamos escrever o esquema para nosso aplicativo “ToDo”. Dentro do diretório todo\_api, crie um novo arquivo chamado _schema.graphql_ e adicione o seguinte esquema a ele:

```
schema {
    query: Query
    mutation: Mutation
}

type Todo {
    id: ID!
    description: String!
    completed: Boolean!
    dueDate: String!
}

type TodoResult {
    success: Boolean!
    errors: [String]
    todo: Todo
}

type TodosResult {
    success: Boolean!
    errors: [String]
    todos: [Todo]
}

type Query {
    todos: TodosResult!
    todo(todoId: ID!): TodoResult!
}

type DeleteTodoResult {
    success: Boolean!
    errors: [String]
}

type Mutation {
    createTodo(description: String!, dueDate: String!): TodoResult!
    deleteTodo(todoId: ID!): DeleteTodoResult!
    markDone(todoId: String!): TodoResult!
    updateDueDate(todoId: String, newDate: String!): TodoResult!
}

```

Definimos algumas coisas em nosso esquema:

1.  Um `Todo`tipo para representar um item em nossa lista de tarefas
2.  Consultas para buscar um único e todos os itens
3.  Mutações para criar e excluir `Todo`itens, marcar um item como concluído e atualizar sua data de vencimento.
4.  Os valores de retorno das consultas e mutações incluem os itens de dados correspondentes mais dois campos extras: `success`e `errors`. Esses campos informarão ao cliente se uma consulta ou mutação foi executada com sucesso e fornecerão mensagens de erro quando houver uma falha.

## Escolhendo uma biblioteca Python para implementar um servidor GraphQL

Construiremos nossa API usando [Ariadne](https://ariadnegraphql.org/) , que é uma biblioteca Python popular para construir servidores GraphQL. Ariadne é uma biblioteca que prioriza o _esquema_ , o que significa que o esquema escrito no SDL é a fonte final da verdade.

Isso é diferente de uma abordagem _code-first_ , em que o código é a fonte da verdade e o esquema é derivado dela. Ambas as abordagens têm seus prós e contras e você pode ler mais sobre as diferenças [aqui](https://blog.logrocket.com/code-first-vs-schema-first-development-graphql/#:~:text=Schema%2Dfirst%20indicates%20that%20we,represent%20the%20GraphQL%20data%20model.) . [Graphene](https://graphene-python.org/) é outra biblioteca GraphQL popular para Python que usa a abordagem code-first.

## Criando um projeto Flask

Agora que já definimos nosso esquema, vamos implementá-lo e montar nossa API GraphQL.

O código da nossa api ficará dentro de um pacote chamado _api_ . Dentro de _todo\_api_ , crie um diretório chamado _api_ e dentro dele crie um arquivo chamado _\_\_init\_\_.py._ Adicione o código abaixo a _api/\_\_init\_\_.py_ para criar um servidor Flask simples que retorne a palavra `Hello!`:

```
from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello!'
```

Na raiz do projeto, crie outro arquivo chamado _main.py_ e atualize-o da seguinte forma:

A estrutura de diretórios deve ter a seguinte aparência:

```
todo_api
├── api
│     └── __init__.py
├── main.py
├── schema.graphql
└── todo_api_env
```

Agora precisamos informar ao Flask onde encontrar a `app`instância do aplicativo. Fazemos isso definindo a variável `FLASK_APP`de ambiente com o nome do arquivo Python de nível superior que possui o aplicativo, que no nosso caso é _main.py_ . Defina da seguinte forma:

Se você estiver usando o Windows, substitua `export`no comando acima por `set`.

Inicie o servidor Flask executando o seguinte comando:

Visite _http://127.0.0.1:5000_ em seu navegador da Web para confirmar se o servidor está funcionando e se tudo está funcionando corretamente.

![Hello Flask](https://twilio-cms-prod.s3.amazonaws.com/images/xBmVTwuCqWhoc_Z5EXzF3NxNoyL7MHGDpYYX6-XxKTH7vl.width-500.png)

### Adicionando o banco de dados

Como queremos poder visualizar nossos itens a fazer a qualquer momento, vamos armazená-los em um banco de dados para que possam ser preservados. Vamos usar o [sqlite](https://www.sqlite.org/index.html) porque é leve e simples o suficiente para começar. Para gerenciar esse banco de dados a partir do aplicativo Flask, usaremos a extensão [Flask-SQLAlchemy .](https://flask-sqlalchemy.palletsprojects.com/)

Vamos em frente e configurar nosso banco de dados. Adicione a configuração ao arquivo _api/\_\_init\_\_.py_ :

```
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.getcwd()}/todo.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


@app.route('/')
def hello():
    return 'Hello!'
```

A `SQLALCHEMY_DATABASE_URI`configuração informa ao Flask-SQLAlchemy onde o arquivo de banco de dados está localizado. No nosso caso, vamos armazená-lo no diretório do projeto com o nome _todo.db_ .

A configuração `SQLALCHEMY_TRACK_MODIFICATIONS`para `False`desabilita o rastreamento de modificações de objetos e o envio de sinais para o aplicativo para cada alteração no banco de dados. É um recurso útil, mas pode causar sobrecarga de memória, portanto, deve ser usado apenas quando necessário.

### Criando o modelo

Nosso banco de dados terá uma tabela, chamada `Todo`, onde armazenaremos nossas pendências. SQLAlchemy torna possível criar tabelas de banco de dados definindo-as como classes Python, com colunas fornecidas como variáveis de classe. Incrível, certo? Nós os chamamos de modelos de banco de dados. Vamos definir nosso `Todo`modelo.

Crie um novo arquivo chamado _models.py_ dentro do pacote api e defina o `Todo`modelo conforme mostrado abaixo:

```
from main import db


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    completed = db.Column(db.Boolean, default=False)
    due_date = db.Column(db.Date)

    def to_dict(self):
        return {
            "id": self.id,
            "completed": self.completed,
            "description": self.description,
            "due_date": str(self.due_date.strftime('%d-%m-%Y'))
        }
```

Nossa `Todo`tabela terá colunas chamadas `id`, `description`e `completed`. `due_date`A `id`coluna será gerada automaticamente. A `description`coluna aceitará strings. A `completed`coluna armazenará um booleano e o padrão será `False`. A `due_date`coluna armazenará datas. Também adicionamos um método bacana chamado `to_dict`que fornecerá uma representação de dicionário de um `Todo`item. Isso será útil quando começarmos a escrever mutações e consultas.

O arquivo de modelos precisa ser importado para o aplicativo. Edite seu arquivo _main.py_ para que fique assim:

```
from api import app, db
from api import models
```

### Create some Todos

Inicie o terminal e inicie o prompt do python executando o interpretador do Python:

Crie a tabela de banco de dados da seguinte forma:

```
>>> from main import db
>>> db.create_all()
>>>
```

Em seguida, crie seu primeiro item de tarefas e salve-o no banco de dados:

```
>>> from datetime import datetime
>>> from api.models import Todo
>>> today = datetime.today().date()
>>> todo = Todo(description="Run a marathon", due_date=today, completed=False)
>>> todo.to_dict()
{'id': None, 'completed': False, 'description': 'Run a marathon', 'due_date': '2020-10-22'}
>>> db.session.add(todo)
>>> db.session.commit()
>>>
```

## Consultas e Mutações

Depois de criar um esquema GraphQL, precisamos criar funções (resolvers) que retornem valores para os diferentes campos definidos nele. Dentro _da api,_ crie dois arquivos chamados _query.py_ e _mutations.py_ .

### Escrevendo a `todos`consulta

Definimos uma consulta chamada todos em nosso esquema GraphQL:

```
type Query {
    todos: TodosResult!
    ...
}
```

Essa consulta retorna um dicionário com as chaves `success`e . O campo é definido como se não houver erros. No caso de um problema, é definido e inclui a lista de erros ocorridos durante a execução. O campo contém a lista de itens. Como mencionado acima, isso significa que essa consulta não é anulável, portanto, ela sempre deve retornar um resultado.`errors``todos``success``True``success``False``errors``todos``Todo``!`

Vamos escrever um resolvedor para buscar todos os `Todo`itens. Adicione o seguinte a _api/queries.py_ :

```
from .models import Todo


def resolve_todos(obj, info):
    try:
        todos = [todo.to_dict() for todo in Todo.query.all()]
        payload = {
            "success": True,
            "todos": todos
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload
```

Uma função de resolução aceita dois argumentos posicionais `obj`e `info`. `obj`é um valor retornado por um resolvedor pai, que neste caso será o resolvedor raiz. `info`contém todas as informações de contexto que o servidor GraphQL forneceu ao resolvedor durante a execução. Esses dados podem incluir informações de autenticação ou uma solicitação HTTP.

Dentro do resolvedor, consultamos a `Todo`tabela para todos os itens, os convertemos em dicionários Python e os adicionamos à carga útil de resposta com a chave `todos`. Se houver algum erro durante a execução, nós o retornamos na chave `errors`dentro do payload da resposta e também definimos `success`como False.

### Vinculando um resolvedor

Uma vez que escrevemos um resolvedor, precisamos informar a Ariadne a qual campo ele corresponde do esquema, então precisamos vincular a `resolve_todos`função ao campo `todos`em nosso esquema GraphQL.

Adicione o seguinte na parte inferior de _main.py_ :

```
from ariadne import load_schema_from_path, make_executable_schema, \
    graphql_sync, snake_case_fallback_resolvers, ObjectType
from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify
from api.queries import resolve_todos

query = ObjectType("Query")

query.set_field("todos", resolve_todos)

type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(
    type_defs, query, snake_case_fallback_resolvers
)
```

Não se preocupe com as importações por enquanto, nós chegaremos a elas em breve.

Importamos `ObjectType`, que é inicializado com o nome do tipo definido no Schema. No nosso caso, inicializamos `ObjectType`com `Query`, pois estamos vinculando nosso resolvedor a um `Query`tipo. O `set_field`método liga o `todos`campo da consulta à nossa função de resolução.

A `load_schema_from_path`função recebe o nome de um arquivo de esquema. Essa função valida o esquema e retorna uma representação de string dele.

A `make_executable_schema`função pega a `type_defs`variável com a representação em string do nosso esquema e o `query`resolvedor que acabamos de criar.

O `snake_case_fallback_resolvers`vem a calhar por causa das diferenças em como escrevemos código Python e código JavaScript. Em Python, normalmente nomeamos variáveis e funções em “snake\_case”, enquanto “camelCase” é preferido em JavaScript. A maioria dos esquemas GraphQL que você encontra usará a convenção JavaScript para nomear os campos (incluindo o que escrevemos). `snake_case_fallback_resolvers`converte um nome de campo para maiúscula antes de procurá-lo no objeto retornado.

### Explorando nossa API

O Ariadne vem com [o GraphQL Playground](https://github.com/graphql/graphql-playground) , que é uma interface gráfica de usuário que podemos executar para testar nossas consultas interativamente. Vamos configurar isso para que possamos começar a testar nossas consultas.

Add the following routes at the bottom of _main.py_:

```
@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()

    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code
```

Start the Flask server with:

Visit [127.0.0.1:5000/graphql](http://127.0.0.1:5000/graphql) and if everything is setup correctly, you should see the page below:

![GraphQL Playground](https://twilio-cms-prod.s3.amazonaws.com/images/fOiJV6dW7f76dzOBupsng5VdjirYhPZf2h4Lo-ADmqwyl5.width-500.png)

Let’s write our first query. Paste the query below in the editor on the left side of the page:

```
query fetchAllTodos {
  todos {
    success
    errors
    todos {
      description
      completed
      id
    }
  }
}
```

We have named our query `fetchAllTodos` and requested for the fields `id`, `completed`, `dueDate` and `description` from the query `todos`.

Hit the play button to the right of the editor and you should see the list of todos. If successful, you should see your results on the right similar to this:

  
![GraphQL query](https://twilio-cms-prod.s3.amazonaws.com/images/Synb0ELryHr17bHawk45FGTp6aGtDFx1y3hIv2mA2-F2Ki.width-500.png)

### Fetching a single item

To fetch a single `Todo` item, we will need to write a special kind of resolver; one that takes arguments.

Here is a sample query that fetches the item with id of 1:

```
query fetchTodo {
  todo(todoId: "1") {
    success
    errors
    todo { id completed description dueDate }
  }
}
```

Paste it on the GraphQL Playground and see how when we execute it we get an obscure response that includes some error messages, among them one that reads “Cannot return null for non-nullable field Query.todo.” This happens because we haven’t written a resolver to resolve the `todo` field of the schema. The response to this query would be `null`, but because we have used the `!` to mark this query as non-nullable, Ariadne returns an error.

Let’s update _api/queries.py_ to add our second resolver:

```
from ariadne import convert_kwargs_to_snake_case

...

@convert_kwargs_to_snake_case
def resolve_todo(obj, info, todo_id):
    try:
        todo = Todo.query.get(todo_id)
        payload = {
            "success": True,
            "todo": todo.to_dict()
        }

    except AttributeError:  # todo not found
        payload = {
            "success": False,
            "errors": [f"Todo item matching id {todo_id} not found"]
        }

    return payload
```

Next add the code to bind the resolver to _main.py_:

```
from api.queries import resolve_todos, resolve_todo

...

query.set_field("todo", resolve_todo)
```

Now restart the Flask server and then run the query above once again and you should get back the `Todo` item matching the given `id`.

Note that we decorated our resolver with `convert_kwargs_to_snake_case`. This is because the argument is passed in as `todoId` on the query, but the corresponding argument on the resolver is named `todo_id`. We could define our resolver as `def resolve_todo(obj, info, todoId)`, but to avoid having to mix snake case and camel case we use the `convert_kwargs_to_snake_case` decorator to convert the incoming arguments to snake case.

The implementation of the resolver queries the `Todo` table for the `Todo` item with the given id and adds it to the response using the key `todo` and the key `success` is set to `True`. If there are any errors during execution, they are included in the `errors` key on the response payload and the key `success` on the response is set to `False`.

### Mutations

We write a mutation resolver in a similar way to how we have written the query resolvers above. The mutation resolver function takes in the `obj` and `info` arguments and any other arguments that are defined in the schema.

Let’s write our first mutation. As defined in the schema, our `createTodo` mutation takes two arguments: `description` and `dueDate`. Add the code below to _api/mutations.py_:

```
from datetime import datetime

from ariadne import convert_kwargs_to_snake_case

from api import db
from api.models import Todo


@convert_kwargs_to_snake_case
def resolve_create_todo(obj, info, description, due_date):
    try:
        due_date = datetime.strptime(due_date, '%d-%m-%Y').date()
        todo = Todo(
            description=description, due_date=due_date
        )
        db.session.add(todo)
        db.session.commit()
        payload = {
            "success": True,
            "todo": todo.to_dict()
        }
    except ValueError:  # date format errors
        payload = {
            "success": False,
            "errors": [f"Incorrect date format provided. Date should be in "
                       f"the format dd-mm-yyyy"]
        }

    return payload
```

First, we decorate our resolver to convert the incoming arguments to snake case. The `due_date` argument is going to be passed as a string with the format `dd-mm-yyyy`, so we convert it to a date object using the `striptime` function.

We finally create a `Todo` object with the arguments given and persist it to the database. If there was an error parsing the date string, the `striptime` function throws a ValueError and we return an error message prompting the user to provide a date in the format `dd-mm-yyyy`.

Let’s bind the mutation resolver. To do this we need to update _main.py_. To help you make these changes correctly, below you can see the first few lines of this file modified to include the mutation. Keep the two Flask routes after these lines.

```
from api import app, db
from api import models
from ariadne import load_schema_from_path, make_executable_schema, \
    graphql_sync, snake_case_fallback_resolvers, ObjectType
from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify
from api.queries import resolve_todos, resolve_todo
from api.mutations import resolve_create_todo

query = ObjectType("Query")

query.set_field("todos", resolve_todos)
query.set_field("todo", resolve_todo)

mutation = ObjectType("Mutation")
mutation.set_field("createTodo", resolve_create_todo)

type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(
    type_defs, query, mutation, snake_case_fallback_resolvers
)
```

Restart the Flask server and then try the following mutation in the playground:

```
mutation newTodo {
  createTodo(description:"Go to the dentist", dueDate:"24-10-2020") {
    success
    errors
    todo {
      id
      completed
      description
    }
  }
}
```

The server should return the result below:

```
{
  "data": {
    "createTodo": {
      "errors": null,
      "success": true,
      "todo": {
        "completed": false,
        "description": "Go to the dentist",
        "id": "2"
      }
    }
  }
}
```

Let’s now add a resolver for the `markDone` mutation. Add the code below to _api/mutations.py_:

```
@convert_kwargs_to_snake_case
def resolve_mark_done(obj, info, todo_id):
    try:
        todo = Todo.query.get(todo_id)
        todo.completed = True
        db.session.add(todo)
        db.session.commit()
        payload = {
            "success": True,
            "todo": todo.to_dict()
        }
    except AttributeError:  # todo not found
        payload = {
            "success": False,
            "errors":  [f"Todo matching id {todo_id} was not found"]
        }

    return payload
```

Here we accept a `todo_id` argument which we use to query for the particular `Todo` item, and then set its `completed` field to `True`.

To make the mutation available on the GraphQL server, let’s bind it as follows in _main.py_:

```
from api.mutations import resolve_create_todo, resolve_mark_done

...

mutation.set_field("markDone", resolve_mark_done)
```

To test it, send a mutation to the server such as this one:

```
mutation markDone {
  markDone(todoId: "1") {
    success
    errors
    todo { id completed description dueDate }
  }
}
```

![GraphQL markDone query](https://twilio-cms-prod.s3.amazonaws.com/images/Z8v-apdKp2KP3njdvXcYZSY1YJbmGMlInlb8AQ28sAFyA6.width-500.png)

Next we want to be able to delete items from the database. Go ahead and add one more mutation to _api/mutations.py_:

```
@convert_kwargs_to_snake_case
def resolve_delete_todo(obj, info, todo_id):
    try:
        todo = Todo.query.get(todo_id)
        db.session.delete(todo)
        db.session.commit()
        payload = {"success": True}

    except AttributeError:
        payload = {
            "success": False,
            "errors": [f"Todo matching id {todo_id} not found"]
        }

    return payload
```

This resolver function accepts a `todo_id`, queries the database for our `Todo` item and then deletes it if it exists. This one returns a `success` value with the type boolean, denoting whether the requested `Todo` was deleted or not and an `errors` value which is a list of any errors that happened during execution.

Let’s go ahead and bind our resolver as follows in _main.py_:

```
from api.mutations import resolve_create_todo, resolve_mark_done, \
    resolve_delete_todo

...

mutation.set_field("deleteTodo", resolve_delete_todo)
```

To test it, send a mutation like the following to the server:

```
mutation {
  deleteTodo(todoId: "1") {
    success
    errors
  }
}
```

![GraphQL deleteTodo query](https://twilio-cms-prod.s3.amazonaws.com/images/5jGp2wy2eGF5KCA7O4PEB3E6cy0g41xCiw-vd4CNU4l3Hp.width-500.png)

It’s possible our users will want to change the due date of an item. We will do that through the last of our mutations, which is called `updateDueDate`. Let’s add a resolver for this mutation in _api/mutations.py_:

```
@convert_kwargs_to_snake_case
def resolve_update_due_date(obj, info, todo_id, new_date):
    try:
        todo = Todo.query.get(todo_id)
        if todo:
            todo.due_date = datetime.strptime(new_date, '%d-%m-%Y').date()
        db.session.add(todo)
        db.session.commit()
        payload = {
            "success": True,
            "todo": todo.to_dict()
        }

    except ValueError:  # date format errors
        payload = {
            "success": False,
            "errors": ["Incorrect date format provided. Date should be in "
                       "the format dd-mm-yyyy"]
        }
    except AttributeError:  # todo not found
        payload = {
            "success": False,
            "errors": [f"Todo matching id {todo_id} not found"]
        }
    return payload
```

This mutation takes two arguments, `todoId` and `newDate`, which are passed on to our resolver as `todo_id` and `new_date` respectively after they are converted to snake case.

  
The `new_date` argument is a string in the format `dd-mm-yyyy`. As we did before, the string is converted to a `datetime.date` object which is set as the `due_date` field on the `Todo` object with the requested `id`. If the requested `Todo` item was not found or there was an error parsing the date string, we add a descriptive error message and add it to the response under the key `errors`

Like all other resolvers, let’s go ahead and bind it as follows in _main.py_:

```
from api.mutations import resolve_create_todo, resolve_mark_done, \
    resolve_delete_todo, resolve_update_due_date

...

mutation.set_field("updateDueDate", resolve_update_due_date)
```

Test the mutation on the server with the following example:

```
mutation updateDueDate {
  updateDueDate(todoId: "2", newDate: "25-10-2020") {
    success
    errors
  }
}
```

![GraphQL updateDueDate query](https://twilio-cms-prod.s3.amazonaws.com/images/YckR03FUJ6o060EAk09Cqwj3ix_uOnnJ7twvOTtUz3tfdq.width-500.png)

## Conclusion

Congratulations for completing this tutorial, you have now built a basic GraphQL server using Flask and Ariadne!

We covered queries, mutations, writing a schema and implementing resolvers. GraphQL defines a third operation besides queries and mutations called [subscriptions](https://ariadnegraphql.org/docs/subscriptions.html), which allow a server to send real time updates to subscribed clients each time new data is available, usually via [WebSocket](https://en.wikipedia.org/wiki/WebSocket). Learning GraphQL puts you next to [all these companies](https://graphql.org/users/) who are already using it.

Learn more about GraphQL [best practices here](https://graphql.org/learn/best-practices/).

_Alex is a developer and technical writer. He enjoys building web APIs and backend systems. You can reach him at:_

-   Github: [https://github.com/alexkiura](https://github.com/alexkiura)
-   Twitter: [https://twitter.com/mistr\_qra](https://twitter.com/mistr_qra)