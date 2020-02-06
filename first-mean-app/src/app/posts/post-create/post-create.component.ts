import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router'

import { Post } from '../post.model'
import { PostsService } from '../posts.service'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  // Properties
  enteredTitle = ''
  enteredContent = ''
  private mode = 'create'
  private postId: string
  private post: Post

  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        // Change the content depending on the postId parameter
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.post = this.postService.getPost(this.postId)
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.postService.addPosts(form.value.title, form.value.content)
    form.resetForm()
  }
}
