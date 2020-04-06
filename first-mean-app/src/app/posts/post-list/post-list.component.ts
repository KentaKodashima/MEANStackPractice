import { Component, OnInit, OnDestroy } from '@angular/core'
import { PageEvent } from '@angular/material'
import { Subscription } from 'rxjs'

import { Post } from '../post.model'
import { PostsService } from '../posts.service'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  isLoading = false
  totalPosts = 0
  postsPerPage = 5
  currentPage = 1
  pageSizeOptions = [1, 2, 5, 10]
  private postsSubscription: Subscription

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], maxPosts: number }) => {
        this.isLoading = false
        this.posts = postData.posts
        this.totalPosts = postData.maxPosts
      })
  }

  onChangedPaged(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
  }

  onDelete(postId: string) {
    this.isLoading = true
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
      })
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe()
  }
}
