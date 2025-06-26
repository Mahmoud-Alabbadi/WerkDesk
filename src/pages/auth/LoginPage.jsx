import React, { useState } from 'react';
    import { useAuth } from '@/hooks/useAuth';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import WerkDeskLogo from '@/assets/WerkDeskLogo';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';

    const LoginPage = () => {
      const [email, setEmail] = useState(); // Default for easy testing
      const [password, setPassword] = useState(); // Default for easy testing
      const { login } = useAuth();
      const { toast } = useToast();

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
          toast({
            title: "Validation Error",
            description: "Please enter both email and password.",
            variant: "destructive",
          });
          return;
        }
        // Mocking role based on email for now
        const role = email.startsWith('admin') ? 'Admin' : 'Partner';
        login({ email, role }); // Pass role here
        toast({
          title: "Login Successful",
          description: "Welcome back to WerkDesk!",
        });
      };

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <WerkDeskLogo className="h-16 w-16" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary">Welcome to WerkDesk</CardTitle>
                <CardDescription>Sign in to manage your repair workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/password-reset" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-base"
                    />
                  </div>
                  <Button type="submit" className="w-full text-lg py-3">
                    Sign In
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Sign Up
                  </Link>
                </p>
                 <p className="text-xs text-muted-foreground pt-4">
              
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default LoginPage;