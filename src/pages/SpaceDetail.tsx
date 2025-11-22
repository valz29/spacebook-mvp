import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, Star, Users, Wifi, Coffee, Tv, 
  AirVent, Car, Shield, Calendar, Clock
} from "lucide-react";
import { useParams } from "react-router-dom";

const SpaceDetail = () => {
  const { id } = useParams();

  // Mock data - en producción vendría de una API
  const space = {
    id,
    title: "Estudio Fotográfico Moderno",
    location: "Ciudad de México, CDMX",
    description: "Espacio amplio y luminoso ideal para sesiones fotográficas profesionales, grabaciones de video y eventos corporativos. Equipado con iluminación profesional, fondos intercambiables y área de descanso.",
    price: 450,
    rating: 4.9,
    reviews: 87,
    capacity: 15,
    area: 120,
    type: "Estudio",
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "WiFi Alta Velocidad" },
      { icon: Coffee, label: "Área de Café" },
      { icon: Tv, label: "TV 4K" },
      { icon: AirVent, label: "Aire Acondicionado" },
      { icon: Car, label: "Estacionamiento" },
      { icon: Shield, label: "Seguridad 24/7" },
    ],
    owner: {
      name: "María González",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      joinedDate: "Enero 2023",
      verified: true,
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2">
            <img 
              src={space.images[0]} 
              alt={space.title}
              className="w-full h-full object-cover"
            />
          </div>
          {space.images.slice(1).map((image, index) => (
            <div key={index} className="aspect-square">
              <img 
                src={image} 
                alt={`${space.title} ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-3">{space.type}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {space.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{space.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium text-foreground">{space.rating}</span>
                      <span>({space.reviews} reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/30 border">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacidad</p>
                    <p className="font-semibold">{space.capacity} personas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Área</p>
                    <p className="font-semibold">{space.area} m²</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">
                {space.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Amenidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {space.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Anfitrión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <img 
                    src={space.owner.avatar} 
                    alt={space.owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{space.owner.name}</h3>
                      {space.owner.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Miembro desde {space.owner.joinedDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    ${space.price}
                  </span>
                  <span className="text-base font-normal text-muted-foreground">/hora</span>
                </CardTitle>
                <CardDescription>Reserva este espacio</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Fecha
                    </Label>
                    <Input id="date" type="date" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Inicio
                      </Label>
                      <Input id="start-time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Fin</Label>
                      <Input id="end-time" type="time" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Número de invitados
                    </Label>
                    <Input 
                      id="guests" 
                      type="number" 
                      placeholder="Ej: 10"
                      max={space.capacity}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje al anfitrión (opcional)</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Cuéntanos sobre tu evento..."
                      rows={3}
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">$450</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tarifa de servicio</span>
                      <span className="font-medium">$45</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>$495</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Solicitar Reserva
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    No se te cobrará todavía. El anfitrión debe confirmar tu reserva.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
