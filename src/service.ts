import { TodoModel, UserModel } from "./interfaces";

export interface TodoService {
  headers: Headers;
}
export class TodoService {
  constructor(token: string) {
    var headers = new Headers();

    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    this.headers = headers;
  }

  listTodos: () => Promise<TodoModel[]> = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_ORIGIN}/todos`, {
      headers: this.headers,
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  saveTodo: (todo: TodoModel, isUpdate?: boolean) => Promise<TodoModel[]> =
    async (todo, isUpdate = false) => {
      const response = await fetch(`${process.env.REACT_APP_API_ORIGIN}/todo`, {
        method: isUpdate ? "PUT" : "POST",
        headers: this.headers,
        body: JSON.stringify(todo),
      });

      if (response.status === 200) {
        return await response.json();
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    };

  deleteTodo: (todo: TodoModel) => Promise<void | Response> = async (todo) => {
    const response: Response = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/todo`,
      {
        method: "DELETE",
        body: JSON.stringify(todo),
        headers: this.headers,
      }
    );
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  getUser: (sub: string) => Promise<UserModel> = async (sub) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/user/${sub}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };
}

let todoService: TodoService;

export const initializeService: (userEmail: string) => TodoService = (
  userEmail
) => {
  todoService = new TodoService(userEmail);
  return todoService;
};

export const getService: () => TodoService = () => {
  return todoService;
};
