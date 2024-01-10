import { createContext, useContext, ReactNode, useState } from "react";
import { User } from "./Types";

interface UsersContextProps {
  users: User[];
  loggedInUser: User | null;
  addUser: (user: User) => void;
  setLoggedInUser: (user: User | null) => void;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <UsersContext.Provider
      value={{ users, loggedInUser, addUser, setLoggedInUser }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

export default UsersProvider;
