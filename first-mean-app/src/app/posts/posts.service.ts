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
  private postsUpdated = new Subject<{ posts: Post[], maxPosts: number }>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // Spread the original post to create a new array so that we don't mutate the original array
    // return [...this.posts]
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message: string, posts: any, maxPosts: number}>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(map((postsData) => {
        return {
          posts: postsData.posts.map((post: PostResponseType) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            }
          }),
          maxPosts: postsData.maxPosts
        }
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts
        this.postsUpdated.next({
          posts: [...this.posts],
          maxPosts: transformedPostsData.maxPosts
        })
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
        this.router.navigate(['/'])
      })
  }

  deletePost(postId: string) {
    console.log(postId, 'postId')
    return this.http.delete(`http://localhost:3000/api/posts/delete/${postId}`)
  }
}
