import "./Login.css";
import BgPattern from "../../assets/images/Login/Bg patterns.png";
import YellowCircle from "../../assets/images/Login/yellow circle_bg.svg";
import OrangeCircle from "../../assets/images/Login/orange circle pattern_bg.svg";
import CornerPattern from "../../assets/images/Login/left bottom corner pattern_bg.png";
import Logo from "../../assets/images/Login/Revalgo White Background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    sessionStorage.setItem("username", username);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="bg">
        <img src={BgPattern} alt="" className="bg-absolute" />
        <img src={YellowCircle} alt="" className="bg-circle yellow" />
        <img src={OrangeCircle} alt="" className="bg-circle orange" />
        <img src={CornerPattern} alt="" className="bg-diamonds left" />
        <img src={CornerPattern} alt="" className="bg-diamonds right" />
      </div>
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="logo">
          <img src={Logo} alt="" />
        </div>
        <br />
        <h1 className="card-header">Welcome Back!</h1>
        <div className="form-field flex-center">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
          />
        </div>
        <div className="form-field flex-center">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="form-field flex-between remember-me">
          <label htmlFor="remember-check">
            <input
              type="checkbox"
              id="remember-check"
              name="remember-me"
              style={{ marginRight: "10px" }}
            />
            Remember me
          </label>
          <div className="forgot-password">Forgot Password ?</div>
        </div>
        <br />
        <br />
        <button type="submit" className="login-btn">
          Log In
        </button>
        <br />
        <span>Or</span>
        <br />
        <a href="#" className="login-with-microsoft">
          Login with Microsoft Account
        </a>
      </form>
    </div>
  );
}
