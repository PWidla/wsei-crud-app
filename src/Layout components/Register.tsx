import { ChangeEvent, FormEvent, useState } from "react";
import { useUsers } from "../Common/Context";
import { User } from "../Common/Types";

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

  function isNullOrEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === "";
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (isNullOrEmpty(formData.login) || isNullOrEmpty(formData.email) || isNullOrEmpty(formData.password) || isNullOrEmpty(formData.confirmPassword) ){
      alert("Fill all fields");
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
    alert("Account created successfully. Now you can log in");
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
