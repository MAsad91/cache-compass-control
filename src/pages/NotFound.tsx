
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-6">
      <div className="text-center space-y-6 max-w-md">
        <XCircle className="h-20 w-20 mx-auto text-error" />
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-xl text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <p className="text-muted-foreground">
          Route: <code className="bg-secondary p-1 rounded">{location.pathname}</code>
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
