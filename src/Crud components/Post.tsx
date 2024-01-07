import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import "../Crud components style/Entity.css";
import "../Crud components style/Post.css";

const MAX_POST_LENGTH = 220;
const MIN_POSTS_PER_PAGE = 1;
const postHeightInPixels = 60;
const singleEntityMarginInPixels = 20;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(MIN_POSTS_PER_PAGE);

  const headerRef = useRef<HTMLDivElement>(null);
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
    fetchAllData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const calculatePostsPerPage = () => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const createFormHeight = createFormRef.current?.offsetHeight || 0;
    const entityContainerHeight = entityContainerRef.current?.offsetHeight || 0;

    const availableHeight =
      window.innerHeight -
      headerHeight -
      createFormHeight -
      entityContainerHeight -
      singleEntityMarginInPixels;

    const newPostsPerPage = Math.max(
      Math.floor(availableHeight / postHeightInPixels),
      MIN_POSTS_PER_PAGE
    );

    setPostsPerPage(newPostsPerPage);
  };

  useEffect(() => {
    calculatePostsPerPage();
    window.addEventListener("resize", calculatePostsPerPage);

    return () => {
      window.removeEventListener("resize", calculatePostsPerPage);
    };
  }, []);

  const shortenContentIfNeeded = (content: string) => {
    return content.length > MAX_POST_LENGTH
      ? content.slice(0, MAX_POST_LENGTH) + "..."
      : content;
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

      <div id="entity-container" ref={entityContainerRef}>
        <h2>Existing posts</h2>
        {posts
          .slice(
            (currentPage - 1) * postsPerPage,
            (currentPage - 1) * postsPerPage + postsPerPage
          )
          .map((post) => (
            <div key={post.id} className="single-entity">
              <h3>{shortenContentIfNeeded(post.title)}</h3>
              <p>{shortenContentIfNeeded(post.body)}</p>
            </div>
          ))}
      </div>

      <div ref={headerRef}>
        {Array.from({
          length: Math.ceil(posts.length / postsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default Post;
