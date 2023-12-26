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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        const newComment: Comment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);

        handleReset();
      } else {
        console.error("Failed to create a comment");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      body: "",
    });
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
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>

      <hr />

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
