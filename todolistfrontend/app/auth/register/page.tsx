'use client';

import * as React from 'react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc'; // Google Icon

import { auth } from '@/firebase'; // Ensure this points to your Firebase initialization file
import { onAuthStateChanged, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        localStorage.setItem('token', idToken);
        router.push('/todos');
      } else {
        localStorage.removeItem('token');
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
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setSuccess(null);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      localStorage.setItem('token', idToken);
      localStorage.setItem('email', email);
      setSuccess('User registered successfully!');
      setError(null);

      router.push('/todos');
    } catch (err: unknown) {
      setError((err as Error).message);
      setSuccess(null);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="registerForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" required />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="registerForm" className="w-full">
          Register
        </Button>
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2">
          <FcGoogle size={20} /> Sign in with Google
        </Button>
        <div className="flex justify-between">
          <Button variant="link" onClick={() => router.push('/login')}>
            Already have an account? Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
