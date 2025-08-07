import { Navbar } from '@/components/layout/navbar'
import { CreatePostForm } from '@/components/posts/create-post-form'

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <CreatePostForm />
      </main>
    </div>
  )
}