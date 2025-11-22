import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ListSpace() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_hour: "",
    capacity: "",
    location: "",
    space_type: "",
    image_url: "",
    amenities: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && userRole !== "owner") {
      navigate("/");
      toast.error("Solo los propietarios pueden listar espacios");
    }
  }, [user, userRole, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const amenitiesArray = formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);

    const { error } = await supabase.from("spaces").insert({
      owner_id: user?.id,
      title: formData.title,
      description: formData.description,
      price_per_hour: parseFloat(formData.price_per_hour),
      capacity: parseInt(formData.capacity),
      location: formData.location,
      space_type: formData.space_type,
      image_url: formData.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      amenities: amenitiesArray,
      status: "active",
    });

    setSubmitting(false);

    if (error) {
      toast.error("Error al crear el espacio");
      console.error(error);
    } else {
      toast.success("Espacio creado exitosamente");
      navigate("/owner-dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Listar Nuevo Espacio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Espacio *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Sala de Reuniones Moderna"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu espacio..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio por Hora *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                    placeholder="50.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ciudad de México"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Espacio *</Label>
                <Select
                  required
                  value={formData.space_type}
                  onValueChange={(value) => setFormData({ ...formData, space_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sala_reuniones">Sala de Reuniones</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                    <SelectItem value="coworking">Coworking</SelectItem>
                    <SelectItem value="estudio">Estudio</SelectItem>
                    <SelectItem value="salon_eventos">Salón de Eventos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenidades (separadas por comas)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, Proyector, Aire acondicionado"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Creando..." : "Crear Espacio"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/owner-dashboard")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
