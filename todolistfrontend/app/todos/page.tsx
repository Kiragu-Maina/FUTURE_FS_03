'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import config from '@/apiconfig';
interface todo {
  id: string;
  title: string;
  content: string;
  status: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  userId: string; // Add this if you are using the userId property
}


export default function todosPage() {
  const router = useRouter();
  const [todos, settodos] = useState<todo[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const backendUrl = config.backendUrl
  console.log(backendUrl)

  useEffect(() => {
    const fetchtodos = async () => {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const email = localStorage.getItem('email');
      
      if (!token) {
        router.push('/auth/login'); // Redirect to login if not authenticated
        
        return;
      }
      setEmail(email);

      try {
        const response = await fetch(`${backendUrl}/api/todos`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          if (errorData.error === 'Invalid token') {
           
            router.push('auth/login'); // Redirect to the login page
            return; // Stop further execution
          }
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        console.log(data);
        settodos(data.todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError('Failed to load todos. Please try again later.');
      }
    };

    fetchtodos();
  }, [router, backendUrl]);

  const handleEdit = (todoId: string) => {
    router.push(`/todos/${todoId}/edit`);
  };

  const handleStatusChange = async (id, title, content, status) => {
    const token = localStorage.getItem("token"); // Get the token
    if (!token) {
      alert("You must be logged in to update the status.");
      return;
    }
  
    try {
      const response = await fetch(`${config.backendUrl}/api/todos/${id}`, {
        method: "PUT", // Assuming you're using PUT for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, status }), // Only updating the status
      });
  
      if (response.ok) {
        // Update the local state
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, status } : todo
        );
        settodos(updatedTodos);
      } else {
        const errorData = await response.json();
        if (errorData.error === "Invalid token") {
          alert("Your session has expired. Please log in again.");
          router.push("/auth/login"); // Redirect to login
        } else {
          alert("Error updating the status. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error updating the status:", error);
      alert("Error updating the status. Please try again.");
    }
  };

  const handleDelete = async (todoId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a todo.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      // Update the UI by removing the deleted todo
      settodos((prevtodos) => prevtodos.filter((todo) => todo.id !== todoId));
      alert('todo deleted successfully!');
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete the todo.');
    }
  };



  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (

    <>
    <div className="text-sm text-gray-600 font-medium">
                {email ? `Logged in as: ${email}` : "Welcome, Guest!"}
              </div>

    <div className="space-y-6 max-w-3xl mx-auto my-8">

      {/* Button to create a new todo */}
      <Button onClick={() => router.push('/todos/create')} className="w-full">
        Create New todo
      </Button>
      {todos
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => b.createdAt._seconds - a.createdAt._seconds) // Sort by createdAt in descending order
     
      .map((todo) => (
        <Card key={todo.id} className="w-full relative">
        {/* Checkbox for status */}
        <input
          type="checkbox"
          checked={todo.status}
          onChange={(e) => handleStatusChange(todo.id, todo.title, todo.content, e.target.checked)}
          className="absolute top-2 right-2 cursor-pointer"
        />
        <CardHeader>
          <CardTitle className={todo.status ? "line-through text-gray-500" : ""}>
            {todo.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={todo.status ? "line-through text-gray-500" : ""}>{todo.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => handleEdit(todo.id)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(todo.id)}>
            Delete
          </Button>
        </CardFooter>
      </Card>

      ))}

    </div>
    </>
  );
}
