# <img src="https://user-images.githubusercontent.com/32459740/39113251-64874c0c-46db-11e8-900d-7f2d8148a00b.png" />

Redux list middleware is a tool to manage the models (like User, Post, Product for instance) in your application in an optimized and simple way.

## Installation

`npm install --save redux-lists`

The redux store should know how to handle actions coming from the redux-lists action creators. To enable this, we need to pass the redux-lists `reducer` to your store:

```javascript
import { createStore, combineReducers } from 'redux';
import { reducer as reduxListsReducer } from 'redux-lists';

const rootReducer = combineReducers({
  // ...your other reducers here
  reduxLists: reduxListsReducer
});

const store = createStore(rootReducer);
```

## Motivations

Redux-lists is useful to:

- Factorize in a single place your models objects
- Do optimistic updates and improve your app responsiveness very easily
- Reduce the redux boilerplate
- Improve code consistency

## Case - a blog app

In a blogging application, we probably will have... Posts ! Using redux, we will want to do the following operations in our app:

- Render a list of blog posts, with only their title and eventually a quick description
- Render a single blog post, with all it's information

If you are used to redux, you probably already are thinking about how you are going to store those objects in the state-tree, the action creators and the selectors that you will have to make to get that data from the tree.

### Redux-lists in action

That's where redux-lists is useful, because it provides you those tools and even more! Here is how it looks like:

*postActions.js*
```javascript
import { getActionCreators } from 'redux-lists';

export const { setList: setPostList, updateItems: updatePosts } = getActionCreators('POSTS');
```

*postSelectors.js*
```javascript
import { getSelectors } from 'redux-lists';

export const { listSelector: postsListSelector, byKeySelector: postByIdSelector } = getSelectors('POSTS');
```

*PostList.js*
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setPostList } from './postActions.js';
import { postsListSelector } from './postSelectors.js';

class PostList extends React.Component {
    componentDidMount() {
        fetch('/posts').then(response => {
            const posts = response.json();
            this.props.setPostList(posts, 'ALL');
        })
    }
    
    render() {
        const { posts } = this.props;
        if (!posts) return 'Loading';
        if (posts.length === 0) return 'No posts yet !';
        
        return (
            <ul>
                {posts.map(post =>
                    <li key={post.id}>
                        {post.label}
                        {post.description}
                    </li>
                )}
            </ul>
        )
    }
}

function mapStateToProps(state) {
    return {
        posts: postsListSelector(state, 'ALL')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPostList: bindActionCreators(setPostList, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
```

*PostPage.js*
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updatePosts } from './postActions.js';
import { postByIdSelector } from './postSelectors.js';

class PostPage extends React.Component {
    componentDidMount() {
        fetch(`/posts/${this.props.id}`).then(response => {
            const post = response.json();
            this.props.updatePosts(post);
        })
    }
    
    render() {
        const { post } = this.props;
        if (!post) return 'Loading';
        
        return (
            <article>
                <h1>{post.label}</h1>
                <h2>{post.author}</h2>
                <h3>{post.createdAt}</h3>
                
                <p>{post.content}</p>
            </article>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const postId = ownProps.id;
    return {
        post: postByIdSelector(state, postId)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updatePosts: bindActionCreators(updatePosts, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
```

### Explanation

Let's take some time here to process and understand what is happening here.

#### Files description

- **postActions.js**

If you are familiar to redux, you know what this is. If you don't, you should learn how [redux](https://redux.js.org/) works first.

- **postSelectors.js**

Contains functions (*memoized*) that go through the redux state-tree to get information in it.

- **PostList.js**

A react component that fetches and renders a list of posts.

- **PostPage.js**

A react component that fetches and renders a blog post page.

#### postActions and postSelectors

In `postActions`, we create the `setPostList` and `updatePosts` *redux-lists* actions.

`getActionCreators` takes two parameters, the first being the **namespace** and the second being an options object.

Indeed, the model's objects (here the posts) are going to be stored in the state tree `@@redux-lists/namespace` (here `@@redux-lists/POSTS`).

Because of this, we also need to create the redux-lists postSelectors in giving it the **namespace** they will have to look in: `getSelectors('POSTS')`.

#### PostList workflow

When the `PostList` component is mounted, an AJAX request is performed to get the `posts` from the server.

When this request is fulfilled, we store those posts in a **list** called `'ALL'` in dispatching `setPostList` action.

> Note: We will see how this list is structured in the redux state-tree right after, just keep in mind that we store the posts in a named list for now.

The state-tree gets updated, the `mapStateToProps` function is called. We use the `postsListSelector` to get the posts we stored in redux. `postsListSelector` takes the redux `state` and the `listName` we stored the posts in.

The posts are passed to our `PostList` and they are rendered in the UI.

#### PostPage workflow

Firstly, let's consider that the user has previously rendered the previous `PostList` to access to the `PostPage`.

When the `PostPage` component is getting mounted, `mapStateToProps` function is called. Since we already have some information about the post in the redux store (label, quick description), the `postByIdSelector` finds them.

It means that the PostPage can render instantly and prepare the user for the rest of the information to be fetched if you want to.

When `PostPage` is mounted, an AJAX request is performed to get the `post` full information (it's content for instance).

When this request is fulfilled, we update the post already stored in redux in dispatching the `updatePosts` action.

The state-tree gets updated, the `mapStateToProps` function is called. Our `postByIdSelector` gets our post with the new information we just fetched and `PostPage` re-renders.

### Redux state-tree sample

To get a better grasp on what's happens with your objects when you set a redux-lists or when you make an update, let's see a sample redux-lists tree that could be produced in an application blog:

```json
{
    "@@redux-lists": {
        "POSTS": {
          "list": {
            "ALL": ["post1", "post2", "post3"],
            "NEW": ["post3"],
            "AUTHOR=MANU": ["post1", "post2"],
            "AUTHOR=TOTO": ["post3"]
          },
          "map": {
            "post1": {
              "id": "post1",
              "label": "My first post !",
              "description": "This is my first post",
              "author": "MANU"
            },
            "post2": {
              "id": "post2",
              "label": "My second post !",
              "description": "This is my second post",
              "content": "Okay, this is my first post and it's about redux-lists!",
              "author": "MANU"
            },
            "post3": {
              "id": "post3",
              "label": "The third post",
              "description": "It's the third post of the blog but my first!",
              "author": "TOTO"
            }
          }
        }
    }
}
```

Redux-lists normalizes your array of objects into a map / list structure. This is pretty convenient because it avoids repetition of information, here the posts objects are in the map and their id used as a reference in the lists.

#### Redux-lists state-tree evolution

Let's consider this state-tree:

```json
{
    "@@redux-lists": {
        "POSTS": {
          "list": {},
          "map": {}
        }
    }
}
```

And let's consider that `fetch('/posts')` returned those `posts`:

```json
[
  {
    "id": "post1",
    "label": "My first post !",
    "description": "This is my first post",
    "author": "MANU"
  },
  {
    "id": "post2",
    "label": "My second post !",
    "description": "This is my second post",
    "author": "MANU"
  },
  {
    "id": "post3",
    "label": "The third post",
    "description": "It's the third post of the blog but my first!",
    "author": "TOTO"
  }
]
```

When we called `setPostList` in our `PostList` component

```javascript
this.props.setPostList(posts, 'ALL');
```

here is what happened to redux-lists state tree:

```json
{
    "@@redux-lists": {
        "POSTS": {
          "list": {
            "ALL": ["post1", "post2", "post3"]
          },
          "map": {
            "post1": {
              "id": "post1",
              "label": "My first post !",
              "description": "This is my first post",
              "author": "MANU"
            },
            "post2": {
              "id": "post2",
              "label": "My second post !",
              "description": "This is my second post",
              "author": "MANU"
            },
            "post3": {
              "id": "post3",
              "label": "The third post",
              "description": "It's the third post of the blog but my first!",
              "author": "TOTO"
            }
          }
        }
    }
}
```

## API

### `getActionCreators(namespace, options)`

- (*String*) `namespace`: A namespace for the map / lists of your model
- (*Object*) `options`: supported options are:
    * (*String*, default = 'id') `onKey`: The key used as reference for objects manipulations
    
`getActionCreators` returns an *Object* containing the keys:

- (*Function*) `setList(items, listName)`: Adds items in the collection + places references in the list
    * (*Array of objects*) `items`: Model objects to be placed in the list. Object must at least have an unique identifier (`id` or the one defined by the above `onKey`)
    * (*String*) name of the list you want to place your objects in.

- (*Function*) `updateItems(items)`: Upsert items in the collection
    * (*Object* or *Array of objects*) `items`: Places the objects into the redux-lists map
    
### `getSelectors(namespace)`

- (*String*) `namespace`: A namespace for the map / lists of your model

`getSelectors` returns an *Object* containing the keys:

- (*Function*) `listSelector(state, listName)`: Returns an array of objects previously put in the list with this *listName*
    * (*Object*) `state`: the entire redux state-tree
    * (*String*) `listName`: the list you want to extract the objects from
    
- (*Function*) `byKeySelector(state, itemKey)`: Returns the object that have the `itemKey` key value (defined with `getActionCreators`)
    * (*Object*) `state`: the entire redux state-tree
    * (*String*) `itemKey`: the itemKey value of the object you want to read on the redux-lists store.
    
> **Note :** The selectors are *memoized* so that if something has been processed / accessed once, it won't compute it again if it's asked another time with the same parameters.
