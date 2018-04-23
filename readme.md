# <img src="https://user-images.githubusercontent.com/32459740/39113251-64874c0c-46db-11e8-900d-7f2d8148a00b.png" />

Redux list middleware is a tool to manage the models (like User, Post, Product for instance) in your application in an optimized and simple way.

## Motivations

Redux-list is useful to:

- Factorize in a single place your models objects
- Do optimistic updates and improve your app responsiveness very easily
- Reduce the redux boilerplate
- Improve code consistency

## Case - a blog app

In a blogging application, we probably will have... Posts ! Using redux, we will want to do the following operations in our app:

- Render a list of blog posts, with only their title and eventually a quick description
- Render a single blog post, with all it's information

If you are used to redux, you probably already are thinking about how you are going to store those objects in the state-tree, the action creators and the selectors that you will have to make to get that data from the tree.

### Redux-list in action

That's where redux-list is useful, because it provides you those tools and even more! Here is how it looks like:

*postActions.js*
```javascript
import { getActionCreators } from 'redux-list';

export const { setList: setPostList, updateItems: updatePosts } = getActionCreators('POSTS');
```

*postSelectors.js*
```javascript
import { getSelectors } from 'redux-list';

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

In `postActions`, we create the `setPostList` and `updatePosts` *redux-list* actions.

`getActionCreators` takes two parameters, the first being the **namespace** and the second being an options object.

Indeed, the model's objects (here the posts) are going to be stored in the state tree `@@redux-list/namespace` (here `@@redux-list/POSTS`).

Because of this, we also need to create the redux-list postSelectors in giving it the **namespace** they will have to look in: `getSelectors('POSTS')`.

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

