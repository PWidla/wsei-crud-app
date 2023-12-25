import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import "../Crud components style/Entity.css";

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

function Comment() {
  console.log("sr");
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    body: "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    alert(
      `Name: ${formData.name}, Email: ${formData.email}, Body: ${formData.body}`
    );
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => response.json())
      .then((json) => setComments(json as Comment[]));
  }, []);

  return (
    <>
      <div id="create-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
          />

          <button type="submit">Submit</button>
        </form>
      </div>

      <div id="entity-container">
        <h2>Existing comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="single-entity">
            <h3>{comment.name}</h3>
            <p>Email: {comment.email}</p>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Comment;
