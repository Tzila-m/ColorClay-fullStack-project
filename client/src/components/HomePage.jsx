import { useSelector } from "react-redux";
import "../css/Home.css";

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="home-centered-container">
      <div className="image-wrapper">
        <img
          src="/pictures/logo2.png"
          alt="Logo"
          className="centered-image"
        />
        <div className="overlay-text">
          <div className="welcome-line">ברוך הבא</div>
          <div className="username-line">{user?.username}</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
