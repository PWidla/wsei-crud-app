import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import "../Crud components style/Entity.css";
import "../Crud components style/User.css";
import UsersProvider, { useUsers } from "../Common/Context";

const MAX_USER_LENGTH = 60;

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

function User() {
  const { loggedInUser } = useUsers();

  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [isUserClicked, setIsUserClicked] = useState<number | null>(null);

  const createFormRef = useRef<HTMLDivElement>(null);
  const entityContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const loggedInUserId = loggedInUser ? loggedInUser.id : null;

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          body: JSON.stringify({ formData }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        const newUser: User = await response.json();
        setUsers((prevUsers) => [...prevUsers, newUser]);
        handleReset();
      } else {
        console.error("Failed to create an user");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
    });
  };

  const handleUpdateUser = async (userId: number) => {
    const updatedUser: User = {
      ...users.find((user) => user.id === userId)!,
      username: formData.username,
      email: formData.email,
    };

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedUser),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, ...updatedUser } : user
          )
        );
        handleReset();
        setIsUserClicked(null);
      } else {
        console.error("Failed to update the user");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
        handleReset();
        setIsUserClicked(null);
      } else {
        console.error("Failed to delete the user");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (response.ok) {
        const newUsers: User[] = await response.json();
        setUsers(newUsers);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    setUsers([]);
    fetchAllData();
  }, []);

  const shortenContentIfNeeded = (content: string) => {
    if (content && content.length > MAX_USER_LENGTH) {
      return content.slice(0, MAX_USER_LENGTH) + "...";
    }
    return content;
  };

  const handleClickUser = (userId: number) => {
    setIsUserClicked((prevUserId) => (prevUserId === userId ? null : userId));
  };

  return (
    <>
      <div id="create-form" ref={createFormRef}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>

      <div id="entity-container" ref={entityContainerRef}>
        <h2>Existing users</h2>
        {users.map((user) => (
          <div
            key={user.id}
            className={`single-entity single-user ${
              isUserClicked === user.id ? "selected-user" : ""
            }`}
            onClick={() => handleClickUser(user.id)}
          >
            <h3>{shortenContentIfNeeded(user.username)}</h3>
            <p>{shortenContentIfNeeded(user.email)}</p>
            {isUserClicked === user.id && (
              <>
                <button onClick={() => handleUpdateUser(user.id)}>
                  Update User
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete User
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default User;
