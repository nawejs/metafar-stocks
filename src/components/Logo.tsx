import { Link } from "react-router-dom";
import "./Logo.css";
export default function Logo() {
  return (
    <div className="logo">
      <Link to="/">
        <span className="twelve">twelve</span>data
      </Link>
    </div>
  );
}
