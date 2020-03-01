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
Property binding can be done with `[target]="property"`.  
Event listening can be done with `(event)="method"`.

```
<!-- post-create.component.html -->

<!-- Property binding -->
<textarea rows="6" [value]="newPost"></textarea>
<hr>
<!-- Listening events -->
<button (click)="onAddPost()">Save post</button>
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

## RXJS
RXJS is suitable as a tool for subscripting to the copy of array and update the original array.

<pre>
// posts.service.ts

// Subject is like a event emitter.
// Something to observe.
<b>import { Subject } from 'rxjs'</b>

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...
  <b>private postsUpdated = new Subject<Post[]>()</b>

  getPosts() {
    ...
  }

  getPostUpdateListener() {
    // Observable is something to subscribe to listen to the value changes.
    return <b>this.postsUpdated.asObservable()</b>
  }

  addPosts(title: string, content: string) {
    ...
    // Push new array and emit values.
    this.postsUpdated.next([...this.posts])
  }
}
</pre>

<pre>
// posts.service.ts

import { Component, <b>OnInit, OnDestroy</b> } from '@angular/core'
<b>import { Subscription } from 'rxjs'</b>

import { Post } from '../post.model'
import { PostsService } from '../posts.service'

@Component({
  ...
})
export class PostListComponent implements <b>OnInit, OnDestroy</b> {
  ...
  <b>private postsSubscription: Subscription</b>

  ...

  ngOnInit() {
    ...
    <b>
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts
      })
    </b>
  }

  // Making sure there's no memory leak
  //   when this component is not in the DOM.
  ngOnDestroy() {
    <b>this.postsSubscription.unsubscribe()</b>
  }
}
</pre>

## Observables (RXJS)

### Observer
Subscribe (listen) to Observables to receive data. Observers can use the following methods to get data.
- next()
- error()
- complete()

### Observable
Passive object to observe. Events like next() cannot be triggered by code.

### Subject
Active object to observe. You can actively triger when the new data is emitted.

## HTTP requests in Angular
We can use `HttpClient` from `@angular/common/http` to setup a http client in Angular.

`HttpClient` is created using Observable, so we need to call subscribe to get the response. Unlike default Observables from RXJS, Angular automatically unsubscribe when it is not in the DOM.

<pre>
...
import { HttpClient } from '@angular/common/http'

...

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...

  <b>constructor(private http: HttpClient) {}</b>

  getPosts() {
    ...

    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts
      })
  }

  ...
}
</pre>

## CORS
CORS stands for Cross Origin Resource Sharing. It allows an app to communicate with the server on a different port. We can allow them in the server by configuring the request header.

## NoSQL vs SQL

### NoSQL
- Enforces no data schema
- Less focused on relations
- Independent documents
- Great for logs, orders, chat messages

### SQL
- Enforces a strict data schema
- Relations are core feature
- Records are related
- Great for shopping carts, contacts, network

## RXJS Operators
The `.pipe()` method allow us to use the operators from RXJS.

- `map()` operator  
Just like the map() function ES, it runs on every element of an array that is emitted by an Observable and store them into an new array.

Official documentation: [https://rxjs-dev.firebaseapp.com/api/operators/map](https://rxjs-dev.firebaseapp.com/api/operators/map)

## Routing
Angular has `RouterModule` by default. Just like the other modules from `@angular/core`, we can import it in the `.module.ts` files.

<pre>
// angular.routing.module.ts

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PostListComponent } from './posts/post-list/post-list.component'
import { PostCreateComponent } from './posts/post-create/post-create.component'

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
]

@NgModule({
  // Register routes config to make Angular be aware of the routes
  imports: [RouterModule.forRoot(routes)],
  // Export the routes to import it in app.module.ts
  exports: [RouterModule]
})
export class AppRoutingModule {}
</pre>

<pre>
// app.module.ts

...
<b>import { AppRoutingModule } from './app.routing.module'</b>
...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    <b>AppRoutingModule</b>
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
</pre>

Then, we can use `<router-outlet></router-outlet>` to actually inform the routers about the routes.

```
// app.component.html

<app-header></app-header>
<main>
  <router-outlet></router-outlet>
</main>
```

In order to use link to the routes, we use `<a routerLink="">`.

```
// header.component.html

<mat-toolbar color="primary">
  <span><a routerLink="/">My Message</a></span>
  <ul>
    <li>
      <a routerLink="/create">New Post</a>
    </li>
  </ul>
</mat-toolbar>
```

### Same component for the different routes

To use the sae component for different routes, we set a path just like the other paths.

<pre>
// app.routing.module.ts

...

const routes: Routes = [
  ...
  { path: <b>'edit/:postId'</b>, component: PostCreateComponent }
]

@NgModule({
  ...
})
export class AppRoutingModule {}
</pre>

Using `ActivatedRoute` observable, we can get information about the active route.

<pre>
...
import { ActivatedRoute, ParamMap } from '@angular/router'

...

@Component({
  ...
})
export class PostCreateComponent implements OnInit {
  // Properties
  ...
  private mode = 'create'
  private postId: string

  constructor(public postService: PostsService, <b>public route: ActivatedRoute<b>) {}
  <b>
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        // Change the content depending on the postId parameter
        this.postId = paramMap.get('postId')
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }
  </b>

  ...
}
</pre>

Then, add `getPost()` to `postService` to fetch the post to edit.

<pre>
// posts.service.ts

...

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...

  // Get post to edit
  getPost(id: string) {
    return {...this.posts.find(post => post.id === id)}
  }
  
  ...
}
</pre>

In order to add a parameter to `routerLink`, we need to use `routerLink="['string', parameter]"` syntax.

```
// post-list.component.html

<mat-accordion multi="true" *ngIf="posts.length > 0">
  <mat-expansion-panel *ngFor="let post of posts">
    ...
      <a mat-button color="primary" [routerLink]="['/edit', post.id]">EDIT</a>
      <button mat-button color="warn" (click)="onDelete(post.id)">DELETE</button>
    ...
  </mat-expansion-panel>
</mat-accordion>
<p class="info-text mat-body-1" *ngIf="posts.length <= 0">No posts</p>
```

## Proxy input event
`#filePicker` is random name.
```
<div>
  <button mat-stroked-button type="button" (click)="filePicker.ckick()">Pick Image</button>
  <input type="file" #filePicker>
</div>
```

## ReactiveFormsModule
<pre>
// post-create.component.ts

...
import { <b>ActivatedRoute</b>, ParamMap } from '@angular/router'

...

@Component({
  ...
})
export class PostCreateComponent implements OnInit {
  // Properties
  ...
  <b>form: FormGroup</b>
  ...

  constructor(
    public postService:
    PostsService, public route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Create a form programmatically
    <b>
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
    })
    </b>
    ...
  }

  onSavePost() {
    ...
    if (this.mode === 'create') {
      this.postService.addPosts(this.form.value.title, this.form.value.content)
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content)
    }

    this.form.reset()
  }
}
</pre>

```
<!-- post-create.component.html  -->

<mat-card>
  <mat-spinner *ngIf="isLoading"></mat-spinner>
  <form [formGroup]="form" (submit)="onSavePost()" *ngIf="!isLoading">
    <mat-form-field>
      <!-- Local reference #title="ngModel" -->
      <input
        matInput
        type="text"
        formControlName='title'
        placeholder="Post Title"
      >
      ...
    </mat-form-field>
    <div>
      ...
    </div>
    <mat-form-field>
      <textarea
        rows="6"
        matInput
        formControlName='content'
        placeholder="Post Content"
      ></textarea>
      ...
    </mat-form-field>
    ...
  </form>
</mat-card>
<hr>
```

