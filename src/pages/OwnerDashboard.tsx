import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

interface Space {
  id: string;
  title: string;
  location: string;
  price_per_hour: number;
  capacity: number;
  status: string;
}

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  spaces: { title: string };
  profiles: { full_name: string };
}

export default function OwnerDashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && userRole !== "owner") {
      navigate("/");
      toast.error("Acceso denegado");
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === "owner") {
      fetchSpaces();
      fetchBookings();
    }
  }, [user, userRole]);

  const fetchSpaces = async () => {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar espacios");
    } else {
      setSpaces(data || []);
    }
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        spaces (title),
        profiles (full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar reservas");
    } else {
      setBookings(data || []);
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard de Propietario</h1>
          <p className="text-muted-foreground">Gestiona tus espacios y reservas</p>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mis Espacios</CardTitle>
            <Button onClick={() => navigate("/list-space")}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Espacio
            </Button>
          </CardHeader>
          <CardContent>
            {spaces.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tienes espacios registrados. ¡Crea tu primer espacio!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Precio/hora</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spaces.map((space) => (
                    <TableRow key={space.id}>
                      <TableCell className="font-medium">{space.title}</TableCell>
                      <TableCell>{space.location}</TableCell>
                      <TableCell>${space.price_per_hour}</TableCell>
                      <TableCell>{space.capacity} personas</TableCell>
                      <TableCell>
                        <Badge variant={space.status === "active" ? "default" : "secondary"}>
                          {space.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/space/${space.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay reservas todavía
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Espacio</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.spaces?.title}</TableCell>
                      <TableCell>{booking.profiles?.full_name || "Usuario"}</TableCell>
                      <TableCell>
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${booking.total_price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {booking.status === "confirmed"
                            ? "Confirmada"
                            : booking.status === "pending"
                            ? "Pendiente"
                            : booking.status === "cancelled"
                            ? "Cancelada"
                            : "Completada"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
