import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import locallyLogo from "@/assets/locally-logo.png";

const Auth = () => {
  const [userType, setUserType] = useState<"tenant" | "owner">("tenant");

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
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Correo electrónico</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Iniciar Sesión
                    </Button>

                    <div className="text-center">
                      <a href="#" className="text-sm text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                  </form>
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
                  <form className="space-y-4">
                    <div className="space-y-3">
                      <Label>¿Qué tipo de cuenta deseas crear?</Label>
                      <RadioGroup 
                        value={userType} 
                        onValueChange={(value) => setUserType(value as "tenant" | "owner")}
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nombre completo</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Correo electrónico</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Contraseña</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password-confirm">Confirmar contraseña</Label>
                      <Input 
                        id="signup-password-confirm" 
                        type="password" 
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Crear Cuenta
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
