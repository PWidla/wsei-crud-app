import React, { useState, useEffect } from "react";
import "../Crud components style/Entity.css";
import "../Crud components style/Album.css";
import UsersProvider, { useUsers } from "../Common/Context";

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
  const { loggedInUser } = useUsers();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [formData, setFormData] = useState({
    title: "",
  });

  const [isAlbumClicked, setIsAlbumClicked] = useState<number | null>(null);
  const createFormRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const loggedInUserId = loggedInUser ? loggedInUser.id : null;

    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Album title cannot be empty");
      return;
    }

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

  const handleUpdate = async (albumId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${albumId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: formData.title,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        const updatedAlbum: Album = await response.json();
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album.id === updatedAlbum.id ? updatedAlbum : album
          )
        );
        handleReset();
      } else {
        console.error("Failed to update the album");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleDelete = async (albumId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${albumId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlbums((prevAlbums) =>
          prevAlbums.filter((album) => album.id !== albumId)
        );
        setPhotos([]); 
        setIsAlbumClicked(null);
      } else {
        console.error("Failed to delete the album");
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
        console.error("Failed to fetch albums");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    setAlbums([]);
    setPhotos([]);
    fetchAllData();
  }, []);

  const handleClickAlbum = (albumId: number) => {
    // fetchPhotosByAlbumId(albumId);
    setIsAlbumClicked((prevAlbumId) => (prevAlbumId === albumId ? null : albumId));
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
              required
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
            className={`single-entity ${
              isAlbumClicked === album.id ? "selected-album" : ""
            }`}
            onClick={() => handleClickAlbum(album.id)}
          >
            <h3>{album.title}</h3>
            <button onClick={() => handleClickAlbum(album.id)}>
              Show Photos
            </button>
            <button onClick={() => handleUpdate(album.id)}>Update</button>
            <button onClick={() => handleDelete(album.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div id="entity-container">
        <h2>Photos in the Selected Album</h2>
        {photos.map((photo) => (
          <div key={photo.id} className="single-entity">
            <h3>{photo.title}</h3>
            <img src={photo.thumbnailUrl} alt={photo.title} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Album;
