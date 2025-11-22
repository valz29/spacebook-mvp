import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - en producción vendría de una API
const featuredSpaces = [
  {
    id: "1",
    title: "Estudio Fotográfico Moderno",
    location: "Ciudad de México, CDMX",
    price: 450,
    rating: 4.9,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
    type: "Estudio",
    capacity: 15,
  },
  {
    id: "2",
    title: "Sala de Juntas Ejecutiva",
    location: "Monterrey, NL",
    price: 320,
    rating: 4.8,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    type: "Oficina",
    capacity: 20,
  },
  {
    id: "3",
    title: "Espacio para Eventos Privados",
    location: "Guadalajara, JAL",
    price: 680,
    rating: 5.0,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    type: "Eventos",
    capacity: 50,
  },
  {
    id: "4",
    title: "Coworking Creativo",
    location: "Puebla, PUE",
    price: 180,
    rating: 4.7,
    reviews: 43,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    type: "Coworking",
    capacity: 12,
  },
  {
    id: "5",
    title: "Salón de Clases Digital",
    location: "Querétaro, QRO",
    price: 280,
    rating: 4.8,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
    type: "Educación",
    capacity: 30,
  },
  {
    id: "6",
    title: "Terraza con Vista Panorámica",
    location: "Cancún, QROO",
    price: 890,
    rating: 5.0,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1519167758481-83f29da8c68e?w=800&h=600&fit=crop",
    type: "Eventos",
    capacity: 80,
  },
];

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
            <SearchBar />
          </div>
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

      {/* Featured Spaces Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Espacios Destacados
              </h2>
              <p className="text-muted-foreground">
                Los espacios más populares y mejor valorados
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/explore">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpaces.map((space) => (
              <SpaceCard key={space.id} {...space} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link to="/explore">
                Ver Todos los Espacios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
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
