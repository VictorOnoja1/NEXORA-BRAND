import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="font-serif text-7xl text-black mb-4">404</p>
      <h1 className="font-serif text-2xl text-chocolate mb-3">Page not found</h1>
      <p className="text-sm text-black font-sans mb-8">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
}
