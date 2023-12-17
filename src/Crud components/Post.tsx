import React from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts: React.FC = () => {
  const posts: Post[] = [
    { id: 1, title: "Post 1", body: "Lorem ipsum..." },
    { id: 2, title: "Post 2", body: "Lorem ipsum..." },
    { id: 3, title: "Post 3", body: "Lorem ipsum..." },
  ];

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
