'use client';

import * as React from 'react';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc'; // Google Icon

import { auth } from '@/firebase'; // Ensure this points to your Firebase initialization file
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          localStorage.setItem('token', idToken);
          localStorage.setItem('email', user.email || ''); // Save email for persistence
          router.push('/todos'); // Redirect if user is logged in
        } catch (error) {
          console.error('Failed to get ID token:', error);
          setError('Failed to authenticate. Please try again.');
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const displayName = result.user.displayName;

      localStorage.setItem('token', idToken);
      localStorage.setItem('email', displayName || '');
      router.push('/todos');
    } catch (error) {
      console.error(error);
      setError('Google Sign-In failed. Please try again.');
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const idToken = await user.getIdToken();
        localStorage.setItem('token', idToken);
        localStorage.setItem('email', email);
        router.push('/todos');
      } else {
        throw new Error('User is null after login.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="loginForm" className="w-full">
          Login
        </Button>
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2">
          <FcGoogle size={20} /> Sign in with Google
        </Button>
        <div className="flex justify-between">
          <Button variant="link" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button variant="link" onClick={() => router.push('/auth/register')}>
            Don&apos;t have an account? Register
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}