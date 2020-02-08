import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
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
  post: Post
  form: FormGroup
  isLoading = false
  private mode = 'create'
  private postId: string

  constructor(
    public postService:
    PostsService, public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      image: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        // Change the content depending on the postId parameter
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content
            }
            this.form.setValue({
              title: this.post.title,
              content: this.post.content
            })
          })
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity()
    console.log(file, 'file')
    console.log(this.form, 'its form')
  }

  onSavePost() {
    if (this.form.invalid) {
      return
    }
    this.isLoading = true
    if (this.mode === 'create') {
      this.postService.addPosts(this.form.value.title, this.form.value.content)
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content)
    }

    this.form.reset()
  }
}
