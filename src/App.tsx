import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { useAuth } from "oidc-react";
import { Todos } from "./components/Todos";
import { ToastContainer, toast } from "react-toastify";
import { IAppProps, ITodo } from "./interfaces";
import { useTodoService } from "./todoService";

import "react-toastify/dist/ReactToastify.css";
import "todomvc-app-css/index.css";

export const App: React.FC<IAppProps> = (props) => {
  const auth = useAuth();
  const { saveTodo, listTodos } = useTodoService();
  const userEmail = props.user.email;
  const userSub = props.user.sub;
  const [todos, setTodos] = useState<ITodo[] | void>([]);
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showActive, setShowActive] = useState<boolean>(true);

  const errorHandler = (errorText: string) => {
    toast.error("Error: " + errorText, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const handleSubmit: () => void = async () => {
    if (userEmail === "" || typeof userEmail === "undefined") {
      errorHandler("No user email found.");
      return;
    }

    try {
      await saveTodo({
        ID: uuid(),
        Title: todoTitle,
        UserEmail: userEmail,
        UserSub: userSub,
        Completed: false,
      });
    } catch (e) {
      console.error(e);
    }
    setTodoTitle("");
    refreshTodos();
  };

  const refreshTodos: () => void = useCallback(() => {
    const getTodos = async () => {
      const todos: ITodo[] = await listTodos();
      setTodos(todos);
    };

    getTodos();
  }, [listTodos]);

  const enableShowCompleted: () => void = () => {
    setShowCompleted(true);
    setShowActive(false);
  };

  const enableShowActive: () => void = () => {
    setShowActive(true);
    setShowCompleted(false);
  };

  useEffect(() => {
    if (todos && todos.length === 0) {
      refreshTodos();
    }
  }, [todos, refreshTodos]);

  return (
    <div className="App">
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(e) => onTodoChange(e)}
            onKeyDown={(e) => {
              e.key === "Enter" && handleSubmit();
            }}
          />
        </header>

        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label>Mark all as complete</label>
          <ul className="todo-list">
            <Todos
              todos={todos}
              refreshTodos={refreshTodos}
              showActive={showActive}
              showCompleted={showCompleted}
              errorHandler={errorHandler}
            />
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>
              {todos?.filter((todo) => !todo.Completed).length ?? 0}
            </strong>{" "}
            item left
          </span>
          <ul className="filters">
            <li>
              <a
                className={showCompleted && showActive ? "selected" : ""}
                onClick={() => {
                  setShowActive(true);
                  setShowCompleted(true);
                }}
                href="/#"
              >
                All
              </a>
            </li>
            <li>
              <a
                className={showActive && !showCompleted ? "selected" : ""}
                onClick={() => enableShowActive()}
                href="/#"
              >
                Active
              </a>
            </li>
            <li>
              <a
                className={showCompleted && !showActive ? "selected" : ""}
                onClick={() => enableShowCompleted()}
                href="/#"
              >
                Completed
              </a>
            </li>
          </ul>
        </footer>
      </section>
      <footer className="info">
        <div className="user-controls">
          <>
            <div className="user-info">{props.user?.email}</div>
            <div className="seperator"></div>
            <div className="auth-button">
              <div onClick={() => auth.signOut()}>Log Out</div>
            </div>
          </>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </footer>
    </div>
  );
};
