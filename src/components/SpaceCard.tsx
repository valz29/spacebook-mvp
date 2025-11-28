import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface SpaceCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
  type: string;
  capacity: number;
}

export const SpaceCard = ({
  id,
  title,
  location,
  price,
  rating,
  reviews,
  image,
  type,
  capacity,
}: SpaceCardProps) => {
  return (
    <Link to={`/space/${id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Badge className="absolute bottom-3 left-3 bg-white/90 text-foreground hover:bg-white">
            {type}
          </Badge>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            {rating && reviews ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-muted-foreground">({reviews})</span>
              </div>
            ) : null}
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">${price}</span>
              <span className="text-sm text-muted-foreground">/hora</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Hasta {capacity} personas
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
