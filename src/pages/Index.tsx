import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Space {
  id: string;
  title: string;
  location: string;
  price_per_hour: number;
  image_url: string;
  space_type: string;
  capacity: number;
}

interface SearchFilters {
  location: string;
  capacity: string;
  priceMax: string;
  spaceType: string;
}

const features = [
  {
    icon: Building2,
    title: "Espacios Verificados",
    description: "Todos los espacios son verificados por nuestro equipo",
  },
  {
    icon: Shield,
    title: "Pago Seguro",
    description: "Transacciones protegidas y garantizadas",
  },
  {
    icon: Clock,
    title: "Reserva Instantánea",
    description: "Confirma tu espacio en segundos",
  },
  {
    icon: TrendingUp,
    title: "Mejor Precio",
    description: "Precios competitivos y transparentes",
  },
];

const Index = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    capacity: "",
    priceMax: "",
    spaceType: "",
  });

  useEffect(() => {
    fetchSpaces();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, spaces]);

  const fetchSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSpaces(data || []);
      setFilteredSpaces(data || []);
    } catch (error) {
      toast.error("Error al cargar los espacios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...spaces];

    if (filters.location) {
      filtered = filtered.filter((space) =>
        space.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.capacity) {
      const capacityNum = parseInt(filters.capacity);
      filtered = filtered.filter((space) => space.capacity >= capacityNum);
    }

    if (filters.priceMax) {
      const priceNum = parseFloat(filters.priceMax);
      filtered = filtered.filter((space) => space.price_per_hour <= priceNum);
    }

    if (filters.spaceType) {
      filtered = filtered.filter((space) => space.space_type === filters.spaceType);
    }

    setFilteredSpaces(filtered);
  };

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Encuentra el Espacio
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Perfecto </span>
              para tu Proyecto
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up">
              Descubre y alquila espacios únicos para reuniones, eventos, producción y más.
            </p>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {filters.location || filters.capacity || filters.priceMax || filters.spaceType ? (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {filteredSpaces.length} {filteredSpaces.length === 1 ? "espacio encontrado" : "espacios encontrados"}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {filters.location || filters.capacity || filters.priceMax || filters.spaceType
                  ? "Resultados de Búsqueda"
                  : "Espacios Disponibles"}
              </h2>
              <p className="text-muted-foreground">
                {filters.location || filters.capacity || filters.priceMax || filters.spaceType
                  ? "Espacios que coinciden con tu búsqueda"
                  : "Explora nuestra selección de espacios únicos"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSpaces.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron espacios
              </h3>
              <p className="text-muted-foreground mb-6">
                {filters.location || filters.capacity || filters.priceMax || filters.spaceType
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Aún no hay espacios disponibles. ¡Sé el primero en publicar!"}
              </p>
              {filters.location || filters.capacity || filters.priceMax || filters.spaceType ? (
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({ location: "", capacity: "", priceMax: "", spaceType: "" })
                  }
                >
                  Limpiar Filtros
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/list-space">Publicar Espacio</Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    id={space.id}
                    title={space.title}
                    location={space.location}
                    price={space.price_per_hour}
                    image={space.image_url}
                    type={space.space_type}
                    capacity={space.capacity}
                  />
                ))}
              </div>

              {filteredSpaces.length < spaces.length && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {filteredSpaces.length} de {spaces.length} espacios disponibles
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¿Tienes un Espacio para Alquilar?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Únete a nuestra comunidad de propietarios y empieza a generar ingresos con tu espacio.
            </p>
            <Button size="lg" variant="secondary" asChild className="shadow-xl">
              <Link to="/list-space">
                Publicar mi Espacio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Carreras</Link></li>
                <li><Link to="/press" className="hover:text-foreground transition-colors">Prensa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">Centro de Ayuda</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contacto</Link></li>
                <li><Link to="/faq" className="hover:text-foreground transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Términos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Síguenos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Locally. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
