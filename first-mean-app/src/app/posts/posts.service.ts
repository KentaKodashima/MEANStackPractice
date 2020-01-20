import { Post } from './post.model'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []

  getPosts() {
    // Spread the original post to create a new array so that we don't mutate the original array
    return [...this.posts]
  }

  addPosts(title: string, content: string) {
    const post: Post = { title, content }
    this.posts.push(post)
  }
}
