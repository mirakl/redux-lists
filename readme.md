# <img src="https://user-images.githubusercontent.com/32459740/39515628-00b21758-4dfb-11e8-8861-c10862f9e343.png" />

Redux lists middleware is a tool to manage the models (like User, Article, Product for instance) in your application in an optimized and simple way.

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

## Table of contents

* [Motivations](#motivations)
* [Concept in draw](#concept-in-draw)
* [Case - a blog app](#case---a-blog-app)
+ [Redux-lists in action](#redux-lists-in-action)
+ [Explanation](#explanation)
  - [Files description](#files-description)
  - [articleActions and articleSelectors](#articleactions-and-articleselectors)
  - [ArticleList workflow](#articlelist-workflow)
  - [ArticlePage workflow](#articlepage-workflow)
+ [Redux state-tree sample](#redux-state-tree-sample)
  - [Redux-lists state-tree evolution](#redux-lists-state-tree-evolution)
* [API](#api)
  + [`getActionCreators(namespace, options)`](#getactioncreatorsnamespace-options)
  + [`getSelectors(namespace)`](#getselectorsnamespace)


## Motivations

Redux-lists is useful to:

- Factorize in a single place your models objects
- Do optimistic updates and improve your app responsiveness very easily
- Reduce the redux boilerplate
- Improve code consistency

## Concept in draw

![image](https://user-images.githubusercontent.com/32459740/39523774-0a7c01ce-4e17-11e8-8054-ca2e8ea465d1.png)
![image](https://user-images.githubusercontent.com/32459740/39522704-571ae6a2-4e13-11e8-901a-797f99ae2728.png)
![image](https://user-images.githubusercontent.com/32459740/39522713-62250c94-4e13-11e8-9776-c4ffa8a9efbe.png)

## Case - a blog app

In a blogging application, we probably will have... Articles ! Using redux, we will want to do the following operations in our app:

- Render a list of blog articles, with only their title and eventually a quick description
- Render a single blog article, with all it's information

If you are used to redux, you probably already are thinking about how you are going to store those objects in the state-tree, the action creators and the selectors that you will have to make to get that data from the tree.

### Redux-lists in action

That's where redux-lists is useful, because it provides you those tools and even more! Here is how it looks like:

*articleActions.js*
```javascript
import { getActionCreators } from 'redux-lists';

export const { setList: setArticleList, updateItems: updateArticles } = getActionCreators('ARTICLES');
```

*articleSelectors.js*
```javascript
import { getSelectors } from 'redux-lists';

export const { listSelector: articlesListSelector, byKeySelector: articleByIdSelector } = getSelectors('ARTICLES');
```

*ArticleList.js*
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setArticleList } from './articleActions.js';
import { articlesListSelector } from './articleSelectors.js';

class ArticleList extends React.Component {
    componentDidMount() {
        fetch('/articles').then(response => {
            response.json().then(articles => {
                this.props.setArticleList(articles, 'ALL');
            });
        })
    }
    
    render() {
        const { articles } = this.props;
        if (!articles) return 'Loading';
        if (articles.length === 0) return 'No articles yet !';
        
        return (
            <ul>
                {articles.map(article =>
                    <li key={article.id}>
                        {article.label}
                        {article.description}
                    </li>
                )}
            </ul>
        )
    }
}

function mapStateToProps(state) {
    return {
        articles: articlesListSelector(state, 'ALL')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setArticleList: bindActionCreators(setArticleList, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
```

*ArticlePage.js*
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateArticles } from './articleActions.js';
import { articleByIdSelector } from './articleSelectors.js';

class ArticlePage extends React.Component {
    componentDidMount() {
        fetch(`/articles/${this.props.id}`).then(response => {
            response.json().then(article => {
                this.props.updateArticles(article);
            });
        })
    }
    
    render() {
        const { article } = this.props;
        if (!article) return 'Loading';
        
        return (
            <article>
                <h1>{article.label}</h1>
                <h2>{article.author}</h2>
                <h3>{article.createdAt}</h3>
                
                <p>{article.content}</p>
            </article>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const articleId = ownProps.id;
    return {
        article: articleByIdSelector(state, articleId)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateArticles: bindActionCreators(updateArticles, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);
```

### Explanation

Let's take some time here to process and understand what is happening here.

#### Files description

- **articleActions.js**

If you are familiar to redux, you know what this is. If you don't, you should learn how [redux](https://redux.js.org/) works first.

- **articleSelectors.js**

Contains functions (*memoized*) that go through the redux state-tree to get information in it.

- **ArticleList.js**

A react component that fetches and renders a list of articles.

- **ArticlePage.js**

A react component that fetches and renders a blog article page.

#### articleActions and articleSelectors

In `articleActions`, we create the `setArticleList` and `updateArticles` *redux-lists* actions.

`getActionCreators` takes two parameters, the first being the **namespace** and the second being an options object.

Indeed, the model's objects (here the articles) are going to be stored in the state tree `@@redux-lists/namespace` (here `@@redux-lists/ARTICLES`).

Because of this, we also need to create the redux-lists articleSelectors in giving it the **namespace** they will have to look in: `getSelectors('ARTICLES')`.

#### ArticleList workflow

When the `ArticleList` component is mounted, an AJAX request is performed to get the `articles` from the server.

When this request is fulfilled, we store those articles in a **list** called `'ALL'` in dispatching `setArticleList` action.

> Note: We will see how this list is structured in the redux state-tree right after, just keep in mind that we store the articles in a named list for now.

The state-tree gets updated, the `mapStateToProps` function is called. We use the `articlesListSelector` to get the articles we stored in redux. `articlesListSelector` takes the redux `state` and the `listName` we stored the articles in.

The articles are passed to our `ArticleList` and they are rendered in the UI.

#### ArticlePage workflow

Firstly, let's consider that the user has previously rendered the previous `ArticleList` to access to the `ArticlePage`.

When the `ArticlePage` component is getting mounted, `mapStateToProps` function is called. Since we already have some information about the article in the redux store (label, quick description), the `articleByIdSelector` finds them.

It means that the ArticlePage can render instantly and prepare the user for the rest of the information to be fetched if you want to.

When `ArticlePage` is mounted, an AJAX request is performed to get the `article` full information (it's content for instance).

When this request is fulfilled, we update the article already stored in redux in dispatching the `updateArticles` action.

The state-tree gets updated, the `mapStateToProps` function is called. Our `articleByIdSelector` gets our article with the new information we just fetched and `ArticlePage` re-renders.

### Redux state-tree sample

To get a better grasp on what's happens with your objects when you set a redux-lists or when you make an update, let's see a sample redux-lists tree that could be produced in an application blog:

```json
{
    "@@redux-lists": {
        "ARTICLES": {
          "list": {
            "ALL": ["article1", "article2", "article3"],
            "NEW": ["article3"],
            "AUTHOR=MANU": ["article1", "article2"],
            "AUTHOR=TOTO": ["article3"]
          },
          "map": {
            "article1": {
              "id": "article1",
              "label": "My first article !",
              "description": "This is my first article",
              "author": "MANU"
            },
            "article2": {
              "id": "article2",
              "label": "My second article !",
              "description": "This is my second article",
              "content": "Okay, this is my first article and it's about redux-lists!",
              "author": "MANU"
            },
            "article3": {
              "id": "article3",
              "label": "The third article",
              "description": "It's the third article of the blog but my first!",
              "author": "TOTO"
            }
          }
        }
    }
}
```

Redux-lists normalizes your array of objects into a map / list structure. This is pretty convenient because it avoids repetition of information, here the articles objects are in the map and their id used as a reference in the lists.

#### Redux-lists state-tree evolution

Let's consider this state-tree:

```json
{
    "@@redux-lists": {
        "ARTICLES": {
          "list": {},
          "map": {}
        }
    }
}
```

And let's consider that `fetch('/articles')` returned those `articles`:

```json
[
  {
    "id": "article1",
    "label": "My first article !",
    "description": "This is my first article",
    "author": "MANU"
  },
  {
    "id": "article2",
    "label": "My second article !",
    "description": "This is my second article",
    "author": "MANU"
  },
  {
    "id": "article3",
    "label": "The third article",
    "description": "It's the third article of the blog but my first!",
    "author": "TOTO"
  }
]
```

When we called `setArticleList` in our `ArticleList` component

```javascript
this.props.setArticleList(articles, 'ALL');
```

here is what happened to redux-lists state tree:

```json
{
    "@@redux-lists": {
        "ARTICLES": {
          "list": {
            "ALL": ["article1", "article2", "article3"]
          },
          "map": {
            "article1": {
              "id": "article1",
              "label": "My first article !",
              "description": "This is my first article",
              "author": "MANU"
            },
            "article2": {
              "id": "article2",
              "label": "My second article !",
              "description": "This is my second article",
              "author": "MANU"
            },
            "article3": {
              "id": "article3",
              "label": "The third article",
              "description": "It's the third article of the blog but my first!",
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
