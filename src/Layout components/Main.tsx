import Album from "../Crud components/Album";
import Comment from "../Crud components/Comment";
import Post from "../Crud components/Post";
import "./Main.css";

interface Props {
  selectedEntity: string | null;
}

function Main({ selectedEntity }: Props) {
  return (
    <div id="main">
      {selectedEntity === "Posts" && <Post />}
      {selectedEntity === "Comments" && <Comment />}
      {selectedEntity === "Albums" && <Album />}
    </div>
  );
}

export default Main;
