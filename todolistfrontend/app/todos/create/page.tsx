'use client'
import * as React from "react"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import config from '@/apiconfig';
export default function CreatetodoPage() {
  const router = useRouter()
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const backendUrl = config.backendUrl

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title || !content) {
      alert("Please fill in both fields!")
      return
    }

    setLoading(true)

    const token = localStorage.getItem("token");  // Retrieve the token from localStorage
    if (!token) {
      alert("You must be logged in to create a todo.");
      setLoading(false);
      return;
    }

    const response = await fetch(`${backendUrl}/api/todos/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Send token in Authorization header
      },
      body: JSON.stringify({ title, content }),
    })

    if (response.ok) {
      router.push("/todos") // Redirect to todos list after successful creation
    } else {
     
      
        const errorData = await response.json(); // Parse the error response
        if (errorData.error === 'Invalid token') {
         
          router.push('auth/login'); // Redirect to the login page
          return; // Stop further execution
        }
        alert("Error creating todo. Please try again.")
      
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div className="flex flex-col">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your todo"
                required
              />
            </div>

            {/* Content Textarea */}
            <div className="flex flex-col">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your todo here..."
                required
                rows={6}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create todo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
