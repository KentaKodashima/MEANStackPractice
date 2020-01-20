# MEAN stack practice

## Objective
This is the repository to store notes and code while I am learning Angular appplication development.

## Components in Angular
The same concept with React, but it's defined in a different way in Angular.

```
// post-create.component.ts

import { Component } from '@angular/core'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
})
export class PostCreateComponent {
  // Properties
  newPost = ''

  // Method
  onAddPost() {
    this.newPost = 'The user/'s post'
  }
}
```

### Integrating with the co-responding html file
```
<!-- post-create.component.html -->

<textarea rows="6" [value]="newPost"></textarea> // Property binding
<hr>
<button (click)="onAddPost()">Save post</button> // Listening events
<p>{{ newPost }}</p> // Outputting properties
```

### Getting input
```
<!-- post-create.component.html -->

<textarea rows="6" [value]="newPost" #postInput></textarea> // Getting input
<hr>
<button (click)="onAddPost(postInput)">Save post</button> // Passing the input
<p>{{ newPost }}</p>
```

### Two-way binding
Read the value and set it into a property inside the post-create.component.ts file.

```
<!-- post-create.component.html -->

<textarea rows="6" [(ngModel)]="enteredValue"></textarea>
```

To do this, we need to configure app.module.ts. Import and add FormsModule as below.

```
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

## Directives
- *ngFor: You can add the logic for a for loop

```
<!-- post-list.component.html -->

<mat-accordion multi="true">
  <mat-expansion-panel *ngFor="let post of posts">
    <mat-expansion-panel-header>
      {{ post.title }}
    </mat-expansion-panel-header>
    <p>
      {{ post.content }}
    </p>
  </mat-expansion-panel>
</mat-accordion>
```

## Event binding
In order to pass around the values from a component to another, we need to add some decorator from Angular.

Modify the post-create component to emit the received values using `EventEmitter` and `Output` from `@angular/core`.

```
// post-create.component.ts

import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  ...
})
export class PostCreateComponent {
  // Properties
  enteredTitle = ''
  enteredContent = ''
  @Output() postCreated = new EventEmitter()

  onAddPost() {
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    }
    this.postCreated.emit(post)
  }
}
```

The emitted value can be received **only from the direct parent**. The code below is passing `onPostAdded` to grab the emitted value from `postCreated`. As an argument for `onPostAdded`, **`$event`** is passed. **`$event`** is the variable representing all the emitted events in Angular.

```
// app.component.ts

@Component({
  ...
})
export class AppComponent {
  storedPosts = []

  onPostAdded(post) {
    this.storedPosts.push(post)
  }
}
```

```
<!-- app.component.html -->

<app-header></app-header>
<main>
  <app-post-create (postCreated)="onPostAdded($event)"></app-post-create>
  ...
</main>
```

Then, finally receive the values in another component via **`Input`** decorator.

```
<!-- app.component.html -->

<main>
  ...
  <app-post-list \**[posts]="storedPosts"\**></app-post-list>
</main>
```

```
// post-list.component.ts

import { Component, Input } from '@angular/core'

@Component({
  ...
})
export class PostListComponent {
  @Input() posts = []
}
```

## Make use of \<form>

Adding event handlers to each `<input>` can be tedious. We can avoid this by wrapping them into a `<form>`.

**Note: It requires `FormsModule` to be added as one of the modules in `app.modules.ts` to detect form submit event in Angular.**

Adding **`ngModel`** (directive without any bindings) to an element will register the element as a control of the form. We need to also add **`name=""`** for Angular to be aware of the element.

We add the **local reference**, **`#postForm="ngForm"`**, to make use of the form object created by Angular and pass it as an argument for `onAddPost()` on submission.

```
<!-- post-create.component.html -->

<mat-card>
  <form (submit)="onAddPost(postForm)" #postForm="ngForm">
    <mat-form-field>
      <!-- Local reference #title="ngModel" -->
      <input
        matInput
        type="text"
        name="title"
        ngModel
        required
        #title="ngModel"
      >
      <mat-error *ngIf="title.invalid">Please enter a post title</mat-error>
    </mat-form-field>
    <mat-form-field>
    	<!-- Local reference #textarea="ngModel" -->
      <textarea
        rows="6"
        matInput
        name="content"
        ngModel
        required
        #content="ngModel"
      ></textarea>
      <mat-error *ngIf="content.invalid">Please enter post contents</mat-error>
    </mat-form-field>
    <button
      mat-raised-button
      color="primary"
      type="submit"
    >
      Save post
    </button>
  </form>
</mat-card>
```

## Service
A service is a class which you add to your Angular application to centralize some tasks and provide easy access to data from any components without any properties or bindings.

The **`@Injectable`** keyword makes a class literally injectable. And we can pass the injectable service via the **`constructor`** for the component where we want to use the service.

The **`public`** keyword creates a new property and assign received values.

```
// posts.service.ts

import { Post } from './post.model'
import { Injectable } from '@angular/core'

// Provide this service at the root level
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []

  getPosts() {
  	 // Arrays are reference type in JS/TS
    // Spread the original post to create a true copy of the array
    //		so that we don't mutate the original array
    return [...this.posts]
  }

  addPosts(title: string, content: string) {
    const post: Post = { title, content }
    this.posts.push(post)
  }
}

```

```
// post-list.component.ts

import { PostsService } from '../posts.service'

// Shothand version
export class PostListComponent {
  @Input() posts: Post[] = []

  constructor(public postsService: PostsService) {}
}

// Equivalent to the shorthand version
export class PostListComponent {
  @Input() posts: Post[] = []
  postsService: PostsService

  constructor(postsService: PostsService) {
  	this.postsService = postsService
  }
}
```