import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context'; // Added

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed for clarity
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { login: authLogin, isLoading: isAuthLoading } = useAuth(); // Use login from context

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token && data.user) {
        authLogin(data.token, data.user); // Use context login function
        toast({ title: 'Login Successful', description: `Welcome back, ${data.user.username}!` });
        navigate('/'); // Redirect to home page
      } else {
        throw new Error(data.message || 'Login failed: Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({ title: 'Login Error', description: errorMessage, variant: 'destructive' });
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Disable form if either auth is loading or form is submitting
  const formDisabled = isAuthLoading || isSubmitting;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={formDisabled}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={formDisabled}
            />
          </div>
          <Button type="submit" className="w-full" disabled={formDisabled}>
            {isSubmitting ? 'Logging in...' : (isAuthLoading ? 'Loading...' : 'Login')}
          </Button>
        </form>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
