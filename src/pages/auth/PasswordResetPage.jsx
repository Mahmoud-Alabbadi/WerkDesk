import React from 'react';
    import { Link } from 'react-router-dom';
    import WerkDeskLogo from '@/assets/WerkDeskLogo';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { motion } from 'framer-motion';

    const PasswordResetPage = () => {
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
                <CardTitle className="text-3xl font-bold text-primary">Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a reset link.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required className="text-base" />
                  </div>
                  <Button type="submit" className="w-full text-lg py-3">
                    Send Reset Link
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Remembered your password?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default PasswordResetPage;