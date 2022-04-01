import * as React from "react";
import { Todo } from "./Todo";
import { TodosProps, TodoModel } from "../interfaces";
import { getService } from "../service";

export const Todos: React.FC<TodosProps> = (props) => {

  const service = getService();
  const handleCompletedChange = async (todoId: string, completed: boolean) => {
    const todo = props.todos?.find((todo) => todo.ID === todoId);
    if (todo) {
      try {
        await service.saveTodo(
          {
            ...todo,
            Completed: completed,
          },
          true
        );
      } catch (e) {
        e instanceof Error && props.errorHandler(e.message);
      }
    } else {
      props.errorHandler("Todo not found");
    }

    props.refreshTodos();
  };

  const handleDeleteChange = async (todo: TodoModel) => {
    try {
      await service.deleteTodo(todo);
    } catch (e) {
      e instanceof Error && props.errorHandler(e.message);
    }

    props.refreshTodos();
  };

  return (
    <div>
      {props.showCompleted &&
        props.todos?
          .filter((todo) => todo.Completed)
          .map((todo) => {
            return (
              <Todo
                todo={todo}
                handleCompletedChange={handleCompletedChange}
                handleDeleteChange={handleDeleteChange}
                key={todo.ID}
              />
            );
          })}
      {props.showActive &&
        props.todos &&
         props.todos
          .filter((todo) => !todo.Completed)
          .map((todo) => {
            return (
              <Todo
                todo={todo}
                handleCompletedChange={handleCompletedChange}
                handleDeleteChange={handleDeleteChange}
                key={todo.ID}
              />
            );
          })}
    </div>
  );
};
