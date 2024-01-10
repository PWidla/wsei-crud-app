import { createContext, useContext, ReactNode, useState } from "react";
import { User } from "../Common/Types";

interface UsersContextProps {
  users: User[];
  addUser: (user: User) => void;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <UsersContext.Provider value={{ users, addUser }}>
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
