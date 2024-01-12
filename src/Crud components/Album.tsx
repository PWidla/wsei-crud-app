import React, { useState, useEffect } from "react";
import "../Crud components style/Entity.css"; // Dodaj odpowiedni plik stylów

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const Album = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [formData, setFormData] = useState({
    title: "",
  });

  const createFormRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/albums",
      {
        method: "POST",
        body: JSON.stringify({
          userId: 1, // Ustaw domyślnego użytkownika, możesz dostosować to do swojej logiki
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
  };

  const handleReset = () => {
    setFormData({
      title: "",
    });
  };

  const fetchPhotosByAlbumId = async (albumId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`
      );

      if (response.ok) {
        const newPhotos = await response.json();
        setPhotos(newPhotos);
      } else {
        console.error("Failed to fetch photos");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
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
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    setAlbums([]);
    fetchAllData();
  }, []);
  const handleClickAlbum = (albumId: number) => {
    fetchPhotosByAlbumId(albumId);
  };

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
              maxLength={220}
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
};

export default Album;
