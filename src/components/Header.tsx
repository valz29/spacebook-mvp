import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import locallyLogo from "@/assets/locally-logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={locallyLogo} alt="Locally" className="h-8" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Explorar Espacios
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Cómo Funciona
          </Link>
          <Link to="/list-space" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Publicar Espacio
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden md:flex">
            <Link to="/auth">Iniciar Sesión</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth">Registrarse</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
