import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

import { Post } from './post.model'
import { PostResponseType } from './types'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient) {}

  getPosts() {
    // Spread the original post to create a new array so that we don't mutate the original array
    // return [...this.posts]

    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postsData) => {
        return postsData.posts.map((post: PostResponseType) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts
        this.postsUpdated.next([...this.posts])
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  // Get post to edit
  getPost(id: string) {
    return {...this.posts.find(post => post.id === id)}
  }

  addPosts(title: string, content: string) {
    const post: Post = { id: null, title, content }
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        const { postId } = response
        post.id = postId
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
      })
  }

  deletePost(postId: string) {
    console.log(postId, 'postId')
    this.http.delete(`http://localhost:3000/api/posts/delete/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
      })
  }
}
