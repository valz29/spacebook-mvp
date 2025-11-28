import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, MapPin, Users, DollarSign } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "El título es demasiado largo"),
  description: z.string().max(1000, "La descripción es demasiado larga").optional(),
  price_per_hour: z.string().min(1, "El precio es requerido").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "El precio debe ser mayor a 0"),
  capacity: z.string().min(1, "La capacidad es requerida").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "La capacidad debe ser mayor a 0"),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres").max(200, "La ubicación es demasiado larga"),
  space_type: z.string().min(1, "El tipo de espacio es requerido"),
  image_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  amenities: z.string().max(500, "Las amenidades son demasiado largas").optional(),
});

export default function ListSpace() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price_per_hour: "",
      capacity: "",
      location: "",
      space_type: "",
      image_url: "",
      amenities: "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && userRole !== "owner") {
      navigate("/");
      toast.error("Solo los propietarios pueden listar espacios");
    }
  }, [user, userRole, loading, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const amenitiesArray = values.amenities
        ? values.amenities.split(",").map((a) => a.trim()).filter((a) => a)
        : [];

      const { error } = await supabase.from("spaces").insert({
        owner_id: user?.id,
        title: values.title,
        description: values.description || null,
        price_per_hour: parseFloat(values.price_per_hour),
        capacity: parseInt(values.capacity),
        location: values.location,
        space_type: values.space_type,
        image_url: values.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        amenities: amenitiesArray,
        status: "active",
      });

      if (error) {
        toast.error("Error al crear el espacio: " + error.message);
        return;
      }

      toast.success("¡Espacio creado exitosamente!");
      navigate("/owner-dashboard");
    } catch (error) {
      toast.error("Error inesperado al crear el espacio");
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Publicar Espacio</h1>
          <p className="text-muted-foreground">Completa la información de tu espacio para comenzar a recibir reservas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información del Espacio
            </CardTitle>
            <CardDescription>
              Los campos marcados con * son obligatorios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Espacio *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Sala de Reuniones Moderna en el Centro" {...field} />
                      </FormControl>
                      <FormDescription>
                        Un título claro y atractivo ayuda a atraer más clientes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe las características principales de tu espacio, qué lo hace especial y para qué tipo de eventos o actividades es ideal..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Destaca las características únicas de tu espacio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price_per_hour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Precio por Hora *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="50.00" {...field} />
                        </FormControl>
                        <FormDescription>En dólares (USD)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Capacidad *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormDescription>Número de personas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Ubicación *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad de México, Polanco" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ciudad y colonia o distrito donde se encuentra el espacio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="space_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Espacio *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de espacio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sala_reuniones">Sala de Reuniones</SelectItem>
                          <SelectItem value="oficina">Oficina</SelectItem>
                          <SelectItem value="coworking">Coworking</SelectItem>
                          <SelectItem value="estudio">Estudio</SelectItem>
                          <SelectItem value="salon_eventos">Salón de Eventos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Categoría que mejor describe tu espacio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Imagen</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://ejemplo.com/imagen.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Si no proporcionas una imagen, se usará una por defecto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenidades</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="WiFi, Proyector, Aire acondicionado, Pizarra, Café" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Separa las amenidades con comas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting} 
                    className="flex-1"
                  >
                    {form.formState.isSubmitting ? "Creando..." : "Crear Espacio"}
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
