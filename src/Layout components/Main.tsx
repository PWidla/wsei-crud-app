import Comments from "../Crud components/Comments";
import Posts from "../Crud components/Posts";
import "./Main.css";

interface Props {
  selectedEntity: string | null;
}

function Main({ selectedEntity }: Props) {
  return (
    <div id="main">
      {selectedEntity === "Posts" && <Posts />}
      {selectedEntity === "Comments" && <Comments />}
    </div>
  );
}

export default Main;
