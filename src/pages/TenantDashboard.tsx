import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  spaces: {
    id: string;
    title: string;
    location: string;
  };
}

export default function TenantDashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && userRole !== "tenant") {
      navigate("/");
      toast.error("Acceso denegado");
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === "tenant") {
      fetchBookings();
    }
  }, [user, userRole]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        spaces (id, title, location)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar reservas");
    } else {
      setBookings(data || []);
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard de Inquilino</h1>
          <p className="text-muted-foreground">Gestiona tus reservas</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Reservas Activas</TabsTrigger>
            <TabsTrigger value="past">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Reservas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                {activeBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No tienes reservas activas
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Explorar Espacios
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Espacio</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.spaces?.title}
                          </TableCell>
                          <TableCell>{booking.spaces?.location}</TableCell>
                          <TableCell>
                            {new Date(booking.start_date).toLocaleDateString()} -{" "}
                            {new Date(booking.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${booking.total_price}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "confirmed" ? "default" : "secondary"
                              }
                            >
                              {booking.status === "confirmed"
                                ? "Confirmada"
                                : "Pendiente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/space/${booking.spaces?.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                {pastBookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No tienes reservas pasadas
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Espacio</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.spaces?.title}
                          </TableCell>
                          <TableCell>{booking.spaces?.location}</TableCell>
                          <TableCell>
                            {new Date(booking.start_date).toLocaleDateString()} -{" "}
                            {new Date(booking.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${booking.total_price}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {booking.status === "completed"
                                ? "Completada"
                                : "Cancelada"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
