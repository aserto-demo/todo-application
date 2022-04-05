import { ITodo, IUser, ITodoService } from "./interfaces";

export class TodoService implements ITodoService {
  constructor(token: string) {
    var headers = new Headers();

    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    this.headers = headers;
    this.usersCache = {};
  }
  headers: Headers;
  usersCache: { [key: string]: IUser };

  listTodos: () => Promise<ITodo[]> = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_ORIGIN}/todos`, {
      headers: this.headers,
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  saveTodo: (todo: ITodo, isUpdate?: boolean) => Promise<ITodo[]> = async (
    todo,
    isUpdate = false
  ) => {
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

  deleteTodo: (todo: ITodo) => Promise<void | Response> = async (todo) => {
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

  getUser: (sub: string) => Promise<IUser> = async (sub) => {
    if (this.usersCache[sub]) {
      return this.usersCache[sub];
    } else {
      console.log("fetching ", sub);
      const response = await fetch(
        `${process.env.REACT_APP_API_ORIGIN}/user/${sub}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (response.status === 200) {
        const user = await response.json();
        this.usersCache[sub] = user;
        console.log("AFTER", this.usersCache);
        return user;
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    }
  };
}

let todoService: TodoService;

export const initializeService: (token: string) => TodoService = (token) => {
  todoService = new TodoService(token);
  return todoService;
};

export const getService: () => TodoService = () => {
  return todoService;
};
