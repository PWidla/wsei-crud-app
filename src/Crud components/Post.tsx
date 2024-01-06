import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import "../Crud components style/Entity.css";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function Post() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({
    title: "",
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
        const newPost: Post = await response.json();
        setPosts((prevPosts) => [...prevPosts, newPost]);

        handleReset();
      } else {
        console.error("Failed to create a post");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      body: "",
    });
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => setPosts(json as Post[]));
  }, []);

  return (
    <>
      <div id="create-form">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
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
        <h2>Existing posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="single-entity">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Post;
