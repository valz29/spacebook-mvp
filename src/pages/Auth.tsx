import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setUserRole } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import locallyLogo from "@/assets/locally-logo.png";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Correo electrónico inválido" }).max(255),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(100),
  email: z.string().trim().email({ message: "Correo electrónico inválido" }).max(255),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string(),
  role: z.enum(["tenant", "owner"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "tenant",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Error de autenticación",
            description: "Correo o contraseña incorrectos",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Error",
            description: "Este correo ya está registrado. Por favor inicia sesión.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        // Insert user role
        try {
          await setUserRole(data.user.id, values.role);
        } catch (roleError) {
          console.error("Error setting user role:", roleError);
        }

        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente. Puedes iniciar sesión ahora.",
        });

        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <img src={locallyLogo} alt="Locally" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bienvenido a Locally
            </h1>
            <p className="text-muted-foreground">
              Encuentra o comparte espacios únicos
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Accede a tu cuenta para continuar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="tu@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Iniciando sesión...
                          </>
                        ) : (
                          "Iniciar Sesión"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>
                    Únete a nuestra comunidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Qué tipo de cuenta deseas crear?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                value={field.value}
                                onValueChange={field.onChange}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div>
                                  <RadioGroupItem 
                                    value="tenant" 
                                    id="tenant" 
                                    className="peer sr-only" 
                                  />
                                  <Label
                                    htmlFor="tenant"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                                  >
                                    <span className="text-lg mb-1">🔍</span>
                                    <span className="font-semibold">Inquilino</span>
                                    <span className="text-xs text-muted-foreground text-center mt-1">
                                      Busco alquilar espacios
                                    </span>
                                  </Label>
                                </div>
                                <div>
                                  <RadioGroupItem 
                                    value="owner" 
                                    id="owner" 
                                    className="peer sr-only" 
                                  />
                                  <Label
                                    htmlFor="owner"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                                  >
                                    <span className="text-lg mb-1">🏠</span>
                                    <span className="font-semibold">Propietario</span>
                                    <span className="text-xs text-muted-foreground text-center mt-1">
                                      Tengo espacios para alquilar
                                    </span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder="Juan Pérez"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="tu@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar contraseña</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando cuenta...
                          </>
                        ) : (
                          "Crear Cuenta"
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Al registrarte, aceptas nuestros{" "}
                        <a href="#" className="text-primary hover:underline">
                          Términos de Servicio
                        </a>{" "}
                        y{" "}
                        <a href="#" className="text-primary hover:underline">
                          Política de Privacidad
                        </a>
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
