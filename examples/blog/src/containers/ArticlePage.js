import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateArticles } from '../actions'
import { articleByIdSelector } from '../selectors'
import PropTypes from 'prop-types'

class ArticlePage extends React.Component {
  componentDidMount () {
    fetch(`http://localhost:3004/articles/${this.props.id}`)
      .then(response => response.json())
      .then(article => {
        this.props.updateArticles(article)
      })
  }

  render () {
    const { article } = this.props
    if (!article) return 'Loading'

    return (
      <article>
        <h1>{article.title}</h1>
        <h2>{article.author}</h2>
        <h3>{article.createdAt}</h3>

        <p>{article.content}</p>
      </article>
    )
  }
}

ArticlePage.propTypes = {
  updateArticles: PropTypes.func,
  id: PropTypes.string,
  article: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    createdAt: PropTypes.string,
    content: PropTypes.string
  })
}

function mapStateToProps (state, ownProps) {
  const articleId = ownProps.match.params.id
  return {
    article: articleByIdSelector(state, articleId),
    id: articleId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateArticles: bindActionCreators(updateArticles, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage)
