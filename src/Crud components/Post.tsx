import React, { useState, useEffect } from "react";
import "../Crud components style/Entity.css";
import "../Crud components style/Post.css";
import UsersProvider, { useUsers } from "../Common/Context";

const MAX_POST_LENGTH = 220;

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

function Post() {
  const { loggedInUser } = useUsers();

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    postIdInput: "",
    userIdInput: "",
  });
  const [isPostClicked, setIsPostClicked] = useState<number | null>(null);

  const createFormRef = React.useRef<HTMLDivElement>(null);
  const entityContainerRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      alert("Title and body cannot be empty");
      return;
    }

    const loggedInUserId = loggedInUser ? loggedInUser.id : null;

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({
            userId: loggedInUserId,
            title: formData.title,
            body: formData.body,
          }),
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
      postIdInput: "",
      userIdInput: "",
    });
  };

  function isNullOrEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === "";
  }

  const handleSearch = async () => {
    if (isNullOrEmpty(formData.postIdInput)) {
      alert("Search input is empty");
    } else {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${formData.postIdInput}`
        );

        if (response.ok) {
          const post: Post = await response.json();
          setPosts([post]);
          setComments([]); 
        } else {
          console.error("Failed to fetch the post");
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  const handleSearchByUser = async () => {
    if (isNullOrEmpty(formData.postIdInput)) {
      alert("Search input is empty");
    } else {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${formData.userIdInput}`
        );

        if (response.ok) {
          const posts: Post[] = await response.json();
          setPosts(posts);
          setComments([]);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        setComments([]);
        setIsPostClicked(null);
      } else {
        console.error("Failed to delete the post");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchCommentsForPost = async (postId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );

      if (response.ok) {
        const newComments: Comment[] = await response.json();
        setComments(newComments);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (response.ok) {
        const newPosts: Post[] = await response.json();
        setPosts(newPosts);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    setPosts([]);
    setComments([]);
    fetchAllData();
  }, []);

  const shortenContentIfNeeded = (content: string) => {
    return content.length > MAX_POST_LENGTH
      ? content.slice(0, MAX_POST_LENGTH) + "..."
      : content;
  };

  const handleClickPost = async (postId: number) => {
    setIsPostClicked((prevPostId) =>
      prevPostId === postId ? null : postId
    );

    if (isPostClicked !== postId) {
      await fetchCommentsForPost(postId);
    }
  };

  const handleUpdate = async (postId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: formData.title,
            body: formData.body,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        const updatedPost: Post = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
        handleReset();
      } else {
        console.error("Failed to update the post");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <>
      <div id="create-form" ref={createFormRef}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>

        <div id="searchContainer">
          <label htmlFor="postIdInput">Post id:</label>
          <input
            type="text"
            id="postIdInput"
            name="postIdInput"
            value={formData.postIdInput}
            onChange={handleChange}
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div id="searchContainer">
          <label htmlFor="userIdInput">User id:</label>
          <input
            type="text"
            id="userIdInput"
            name="userIdInput"
            value={formData.userIdInput}
            onChange={handleChange}
          />
          <button type="button" onClick={handleSearchByUser}>
            Search
          </button>
        </div>
      </div>

      <div id="entity-container" ref={entityContainerRef}>
        <h2>Existing posts</h2>
        {posts.map((post) => (
          <div
            key={post.id}
            className={`single-entity ${
              isPostClicked === post.id ? "selected-post" : ""
            }`}
            onClick={() => handleClickPost(post.id)}
          >
            <h3>{shortenContentIfNeeded(post.title)}</h3>
            <p>{shortenContentIfNeeded(post.body)}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
            <button onClick={() => handleUpdate(post.id)}>
              Update (with data in form)
            </button>
            {isPostClicked === post.id && (
              <>
                <h4>Comments:</h4>
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-entity">
                    <h1>{comment.name}</h1>
                    <p>
                      {comment.body}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Post;
