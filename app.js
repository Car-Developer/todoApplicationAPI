const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { addDays } = require("date-fns");

const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();

let db = null;
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error :${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertTodoObjectToResponseObject = (Object) => {
  return {
    id: Object.id,
    todo: Object.todo,
    category: Object.category,
    priority: Object.priority,
    status: Object.status,
    dueDate: Object.due_date,
  };
};

//get todo's using status API

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q, category } = request.query;
  if (priority === "HIGH" && status === "IN PROGRESS") {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE priority = '${priority}'
            AND status = '${status}';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (category === "WORK" && status === "DONE") {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE category = '${category}'
            AND status = '${status}';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (priority === "HIGH" && category === "LEARNING") {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE category = '${category}'
            AND priority = '${priority}';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (category === "HOME") {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE category = '${category}';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (status === "TO DO") {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE status = '${status}';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (priority === "HIGH") {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE priority = '${priority}';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (search_q !== undefined) {
    const getTodoQuery = `
            SELECT * 
            FROM todo
            WHERE todo LIKE '%${search_q}%';`;
    const todosList = await db.all(getTodoQuery);
    response.send(
      todosList.map((eachObject) =>
        convertTodoObjectToResponseObject(eachObject)
      )
    );
  } else if (status === undefined) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (priority === undefined) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (category === undefined) {
    response.status(400);
    response.send("Invalid Todo Category");
  }
});

//API-2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
  SELECT * FROM todo
  WHERE id = ${todoId};`;
  const todo = await db.get(getTodoQuery);
  response.send(convertTodoObjectToResponseObject(todo));
});

//API-3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const getTodoQuery = `
    SELECT * FROM todo
    WHERE due_date = '${date}';`;
  const todosList = await db.all(getTodoQuery);
  response.send(
    todosList.map((eachObject) => convertTodoObjectToResponseObject(eachObject))
  );
});

//create todo

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const createTodoQuery = `
    INSERT INTO 
    todo(id,todo,priority,status,category,due_date)
    VALUES(
       id =  ${id},
       todo =  '${todo}',
       priority =  '${priority}',
       status = '${status}',
       category =  '${category}',
       due_date = '${dueDate}'
        );`;
  await db.run(createTodoQuery);
  response.send("Todo Successfully Added");
});

//update
app.put("/todos/todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { id, todo, priority, status, category, dueDate } = request.body;
  const updateTodoQuery = `
  UPDATE FROM todo 
  SET(
       ${id},
       '${todo}',
       '${priority}',
       '${status}',
       '${category}',
       '${dueDate}'
  )
  WHERE id = ${todoId};`;
  await db.run(updateTodoQuery);
  response.send("update");
});
module.exports = app;
