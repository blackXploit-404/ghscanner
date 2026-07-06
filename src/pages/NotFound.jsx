import { Link } from "react-router-dom";
import useSeo from "../lib/useSeo";

export default function NotFound() {
  useSeo({ title: "Page not found", path: "/404" });

  return (
    <main className="page textPage">
      <h1>hey mf!</h1>
      <p>That page doesn't exist. <Link to="/">Back to the 127.0.0.1</Link>.</p>
    </main>
  );
}
