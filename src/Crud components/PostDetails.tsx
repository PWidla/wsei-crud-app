interface Props {
  selectedPost: number | null;
}

function PostDetails({ selectedPost }: Props) {
  console.log(selectedPost);
  return <div>PostDetails</div>;
}

export default PostDetails;
