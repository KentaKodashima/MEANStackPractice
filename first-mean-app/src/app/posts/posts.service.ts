import { Post } from './post.model'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  getPosts() {
    // Spread the original post to create a new array so that we don't mutate the original array
    return [...this.posts]
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  addPosts(title: string, content: string) {
    const post: Post = { title, content }
    this.posts.push(post)
    this.postsUpdated.next([...this.posts])
  }
}
