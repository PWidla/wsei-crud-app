import { ChangeEvent, FormEvent, useState } from "react";
import Register from "./Register";
import "../Crud components style/Login.css";
import { User } from "../Common/types";

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [formData, setFormData] = useState<User>({
    login: "",
    password: "",
  });

  const [showRegister, setShowRegister] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onLogin(formData);
    console.log("logged in succesfully");
  };

  const handleToggleRegister = () => {
    setShowRegister((prevShowRegister) => !prevShowRegister);
  };

  return (
    <>
      <h2>{showRegister ? "Register" : "Login"} Form</h2>
      <div id="create-form">
        {showRegister ? (
          <Register />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="login">Login:</label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit">Log in</button>
          </form>
        )}

        <button type="button" onClick={handleToggleRegister}>
          {showRegister ? "Already have an account?" : "Don't have an account?"}
        </button>
      </div>
    </>
  );
}

export default Login;
