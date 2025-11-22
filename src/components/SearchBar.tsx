import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-card-hover p-2 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-foreground block">Ubicación</label>
              <Input 
                placeholder="¿Dónde buscas?" 
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
            <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-foreground block">Fecha</label>
              <Input 
                type="date"
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
            <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-foreground block">Capacidad</label>
              <Input 
                type="number" 
                placeholder="Personas" 
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          
          <Button size="lg" className="w-full md:w-auto rounded-xl">
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};
