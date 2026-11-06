import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articlesData } from '../data/articlesData'
import ArticleReaderModal from './ArticleReaderModal'
import './ArticlesSection.css'

const ArticlesSection = () => {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const displayedArticles = showAll ? articlesData : articlesData.slice(0, 2)

  return (
    <section className="articles" id="articles-section">
      <div className="container">
        <div className={`articles__layout ${showAll ? 'articles__layout--expanded' : ''}`}>
          {/* Left Panel */}
          <div className="articles__left">
            <h2 className="articles__title">
              Read top articles from<br />
              health experts
            </h2>
            <p className="articles__subtitle">
              Health articles that keep you informed about good health practices and achieve your goals.
            </p>

            <div className="articles__action-group">
              <button
                id="see-all-articles-btn"
                className="articles__see-all"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Top Articles' : 'See all articles'}
              </button>

              <button
                id="view-library-page-btn"
                className="articles__library-link"
                onClick={() => navigate('/articles')}
              >
                Explore Health Library ➔
              </button>
            </div>
          </div>

          {/* Right Panel: Top 2 or All Article Cards */}
          <div className={`articles__grid ${showAll ? 'articles__grid--expanded' : ''}`}>
            {displayedArticles.map((article, i) => (
              <article
                key={article.id}
                id={article.id}
                className="article-card"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setSelectedArticle(article)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedArticle(article)}
              >
                <div className="article-card__image-wrap">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-card__img"
                    loading="lazy"
                  />
                  {article.readTime && (
                    <span className="article-card__read-badge">{article.readTime}</span>
                  )}
                </div>

                <div className="article-card__body">
                  <span className="article-card__category">{article.category}</span>
                  <h3 className="article-card__card-title">{article.title}</h3>
                  <div className="article-card__meta">
                    <span className="article-card__author">{article.author}</span>
                    <span className="article-card__read-now">Read Article ➔</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Article Reading Modal */}
      {selectedArticle && (
        <ArticleReaderModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  )
}

export default ArticlesSection
