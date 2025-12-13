import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Copyright © <Link to="/" className="hover:underline font-medium">Sports Scoreboard</Link> {new Date().getFullYear()}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
