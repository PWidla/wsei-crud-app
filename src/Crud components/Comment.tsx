import { useState, useEffect } from "react";

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

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => response.json())
      .then((json) => setComments(json as Comment[]));
  }, []);

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <h3>{comment.name}</h3>
            <p>Email: {comment.email}</p>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comment;
