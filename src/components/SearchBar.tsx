import { useState } from "react";
import { Search, MapPin, DollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (filters: {
    location: string;
    capacity: string;
    priceMax: string;
    spaceType: string;
  }) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [spaceType, setSpaceType] = useState("");

  const handleSearch = () => {
    onSearch({
      location,
      capacity,
      priceMax,
      spaceType,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl shadow-card-hover p-2 border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-foreground block">Ubicación</label>
              <Input 
                placeholder="Ciudad o colonia" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
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
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
            <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-foreground block">Precio Máx.</label>
              <Input 
                type="number" 
                placeholder="Por hora" 
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-foreground block mb-1">Tipo</label>
              <Select value={spaceType} onValueChange={setSpaceType}>
                <SelectTrigger className="border-0 p-0 h-auto text-sm focus-visible:ring-0 w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  <SelectItem value="sala_reuniones">Sala de Reuniones</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="coworking">Coworking</SelectItem>
                  <SelectItem value="estudio">Estudio</SelectItem>
                  <SelectItem value="salon_eventos">Salón de Eventos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button size="lg" onClick={handleSearch} className="w-full md:w-auto rounded-xl">
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};
