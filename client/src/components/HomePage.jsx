import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h1>ברוך הבא {user?.username}</h1>
    </div>
  );
};
export default HomePage;