import { ChangeEvent, FormEvent, useState } from "react";
import { useUsers } from "../Common/Context";
import { User } from "../Common/types";

function Register() {
  const { users, addUser } = useUsers();

  const [formData, setFormData] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.email || !formData.email.trim()) {
      console.log("Podaj maila bucu");
      return;
    }

    const isLoginUnique = !users.some((user) => user.login === formData.login);
    const isEmailUnique = !users.some((user) => user.email === formData.email);

    if (!isLoginUnique) {
      alert("Login already taken");
      return;
    }

    if (!isEmailUnique) {
      alert("Email already registered");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      ...formData,
    };

    addUser(newUser);
    console.log("Utworzony:", newUser);
  };

  return (
    <div>
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
        <div className="form-field">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
