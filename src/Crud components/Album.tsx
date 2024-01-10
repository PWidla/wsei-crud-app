import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import "../Crud components style/Entity.css";
import UsersProvider, { useUsers } from "../Common/Context";

const MAX_ALBUM_TITLE_LENGTH = 50;

interface Album {
  userId: number;
  id: number;
  title: string;
}

function Album() {
  const { loggedInUser } = useUsers();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [formData, setFormData] = useState({
    title: "",
  });

  const createFormRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const loggedInUserId = loggedInUser ? loggedInUser.id : null;

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/albums",
        {
          method: "POST",
          body: JSON.stringify({
            userId: loggedInUserId,
            title: formData.title,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        const newAlbum: Album = await response.json();
        setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
        handleReset();
      } else {
        console.error("Failed to create an album");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
    });
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/albums"
      );
      if (response.ok) {
        const newAlbums: Album[] = await response.json();
        setAlbums(newAlbums);
      } else {
        console.error("Failed to fetch albums");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    setAlbums([]);
    fetchAllData();
  }, []);

  const handleClickAlbum = (albumId: number) => {};

  return (
    <>
      <div id="create-form" ref={createFormRef}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Album Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={MAX_ALBUM_TITLE_LENGTH}
            />
          </div>

          <button type="submit">Create Album</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>

      <div id="entity-container">
        <h2>Existing albums</h2>
        {albums.map((album) => (
          <div
            key={album.id}
            className="single-entity"
            onClick={() => handleClickAlbum(album.id)}
          >
            <h3>{album.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

export default Album;
