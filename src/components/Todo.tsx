import React, { useEffect, useState } from "react";
import { ITodoProps, IUser } from "../interfaces";
import { getService } from "../service";

export const Todo: React.FC<ITodoProps> = (todoProps) => {
  const [user, setUser] = useState<IUser>();
  const service = getService();
  useEffect(() => {
    const getUser = async () => {
      try {
        const userRes: IUser = await service.getUser(todoProps.todo.UserSub);
        setUser(userRes);
      } catch (e) {
        console.error(e);
      }
    };
    getUser();
  }, [service, todoProps.todo.UserSub]);

  return (
    <li className={todoProps.todo.Completed ? "completed" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={() =>
            todoProps.handleCompletedChange(
              todoProps.todo.ID,
              !todoProps.todo.Completed
            )
          }
          checked={todoProps.todo.Completed}
        />
        <label
          onClick={() =>
            todoProps.handleCompletedChange(
              todoProps.todo.ID,
              !todoProps.todo.Completed
            )
          }
        >
          {todoProps.todo.Title}
          {user?.picture ? (
            <img
              alt="user"
              style={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "block",
                float: "right",
                marginRight: 50,
              }}
              src={user.picture}
            />
          ) : null}
        </label>
        <button
          className="destroy"
          onClick={() => todoProps.handleDeleteChange(todoProps.todo)}
        ></button>
      </div>
    </li>
  );
};
