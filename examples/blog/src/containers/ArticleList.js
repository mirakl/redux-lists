import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setArticleList } from '../actions';
import { articlesListSelector } from '../selectors';
import { Link } from 'react-router-dom';

class ArticleList extends React.Component {
    componentDidMount() {
        fetch('http://localhost:3004/articles')
            .then(response => response.json())
            .then(articles => {
                this.props.setArticleList(articles, 'ALL');
            });
    }

    render() {
        const { articles } = this.props;
        if (!articles) return 'Loading';
        if (articles.length === 0) return 'No articles yet !';

        return (
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        <Link to={`/article/${article.id}`}>
                            {article.title}
                        </Link>
                        {article.description}
                    </li>
                ))}
            </ul>
        );
    }
}

ArticleList.propTypes = {
    setArticleList: PropTypes.func,
    articles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            description: PropTypes.string,
        })
    ),
};

function mapStateToProps(state) {
    return {
        articles: articlesListSelector(state, 'ALL'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setArticleList: bindActionCreators(setArticleList, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
