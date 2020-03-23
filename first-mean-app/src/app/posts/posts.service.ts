import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'

import { Post } from './post.model'
import { PostResponseType } from './types'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // Spread the original post to create a new array so that we don't mutate the original array
    // return [...this.posts]

    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postsData) => {
        return postsData.posts.map((post: PostResponseType) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts
        this.postsUpdated.next([...this.posts])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData
    if (typeof(image) === 'object') {
      postData = new FormData()
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image)
    } else {
      postData = { id, title, content, imagePath: image }
    }
    this.http.patch(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex(updatedPost => updatedPost.id === id)
        const post = {
          id,
          title,
          content,
          imagePath: ""
        }
        updatedPosts[oldPostIndex] = post
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
        this.router.navigate(['/'])
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  // Get post to edit
  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)
    this.http.post<{message: string, post: Post}>(
      'http://localhost:3000/api/posts',
      postData
    )
      .subscribe((response) => {
        const post: Post = {
          id: response.post.id,
          title,
          content,
          imagePath: response.post.imagePath
        }
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
        this.router.navigate(['/'])
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
