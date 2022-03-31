export interface TodoModel {
  ID: string;
  Title: string;
  Completed: boolean;
  UserEmail: string;
  UserSub: string;
}

export interface TodoProps {
  todo: TodoModel;
  handleCompletedChange: (todoId: string, completed: boolean) => void;
  handleDeleteChange: (Todo: TodoModel) => void;
}

export interface TodosProps {
  todos: TodoModel[] | void;
  showCompleted: boolean;
  showActive: boolean;
  refreshTodos: () => void;
  errorHandler(errorText: string): void;
}

export interface TodoState {}

export interface UserModel {
  id: string;
  email: string;
  picture: string;
  name: string;
}

export interface AppProps {
  user: AuthUser
}

export interface AuthUser {
  id_token: string;
  profile: Profile;
}

export interface Profile {
  email: string
  sub: string
}
