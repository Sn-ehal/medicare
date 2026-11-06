import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ArticleReaderModal from '../components/ArticleReaderModal'
import { articlesData } from '../data/articlesData'
import './ArticlesPage.css'

const CATEGORIES = [
  'All Articles',
  'Coronavirus & Viral',
  'Vitamins & Nutrition',
  'Heart & Cardiology',
  'Diabetes Care',
  'Skin & Hair',
  'Eye Care',
  'Bone & Joint',
  'Digestive Health',
  'Mental Wellness',
]

const ArticlesPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Articles')
  const [activeArticle, setActiveArticle] = useState(null)

  useEffect(() => {
    document.title = 'Health Articles & Medical Advice | MediCare'
  }, [])

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      // Category Filter
      let matchesCat = true
      if (selectedCategory !== 'All Articles') {
        const catUpper = article.category.toUpperCase()
        if (selectedCategory === 'Coronavirus & Viral') {
          matchesCat = catUpper.includes('CORONA') || catUpper.includes('VIRAL')
        } else if (selectedCategory === 'Vitamins & Nutrition') {
          matchesCat = catUpper.includes('VITAMIN') || catUpper.includes('NUTRITION')
        } else if (selectedCategory === 'Heart & Cardiology') {
          matchesCat = catUpper.includes('HEART') || catUpper.includes('CARDIO')
        } else if (selectedCategory === 'Diabetes Care') {
          matchesCat = catUpper.includes('DIABETES') || catUpper.includes('ENDOCRIN')
        } else if (selectedCategory === 'Skin & Hair') {
          matchesCat = catUpper.includes('SKIN') || catUpper.includes('HAIR') || catUpper.includes('DERM')
        } else if (selectedCategory === 'Eye Care') {
          matchesCat = catUpper.includes('EYE') || catUpper.includes('OPHTHAL')
        } else if (selectedCategory === 'Bone & Joint') {
          matchesCat = catUpper.includes('BONE') || catUpper.includes('JOINT') || catUpper.includes('ORTHO')
        } else if (selectedCategory === 'Digestive Health') {
          matchesCat = catUpper.includes('DIGEST') || catUpper.includes('GASTRO') || catUpper.includes('GUT')
        } else if (selectedCategory === 'Mental Wellness') {
          matchesCat = catUpper.includes('MENTAL') || catUpper.includes('ANXIETY') || catUpper.includes('PSYCH')
        }
      }

      // Search Filter
      let matchesSearch = true
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim()
        matchesSearch =
          article.title.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query) ||
          (article.summary && article.summary.toLowerCase().includes(query))
      }

      return matchesCat && matchesSearch
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="articles-page">
      <Navbar />

      <main className="articles-page__main">
        {/* Hero Section */}
        <section className="articles-hero">
          <div className="container articles-hero__container">
            <span className="articles-hero__eyebrow">MEDICARE HEALTH LIBRARY</span>
            <h1 className="articles-hero__title">
              Read Top Articles from Verified Health Experts
            </h1>
            <p className="articles-hero__subtitle">
              Evidence-based medical guides, wellness practices, and actionable advice written and reviewed by licensed clinical doctors.
            </p>

            {/* Search Bar */}
            <div className="articles-hero__search-wrap">
              <svg className="articles-hero__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="articles-hero__search-input"
                placeholder="Search by symptom, topic, disease, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="articles-hero__clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="articles-hero__categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`articles-hero__cat-pill ${selectedCategory === cat ? 'articles-hero__cat-pill--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Catalog Grid Section */}
        <section className="articles-catalog container">
          <div className="articles-catalog__header">
            <div className="articles-catalog__count">
              Showing <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== 'All Articles' && ` in "${selectedCategory}"`}
            </div>
            {(searchTerm || selectedCategory !== 'All Articles') && (
              <button
                className="articles-catalog__reset-btn"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All Articles')
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <div className="articles-catalog__grid">
              {filteredArticles.map((article, idx) => (
                <article
                  key={article.id}
                  id={article.id}
                  className="catalog-card"
                  onClick={() => setActiveArticle(article)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveArticle(article)}
                >
                  <div className="catalog-card__img-wrap">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="catalog-card__img"
                      loading="lazy"
                    />
                    <span className="catalog-card__badge">{article.readTime}</span>
                  </div>

                  <div className="catalog-card__body">
                    <span className="catalog-card__category">{article.category}</span>
                    <h2 className="catalog-card__title">{article.title}</h2>
                    <p className="catalog-card__summary">{article.summary}</p>

                    <div className="catalog-card__footer">
                      <div className="catalog-card__author">
                        <span className="catalog-card__author-icon">👨‍⚕️</span>
                        <span>{article.author}</span>
                      </div>
                      <span className="catalog-card__read-link">
                        Read Article ➔
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="articles-catalog__empty">
              <div className="articles-catalog__empty-icon">🔍</div>
              <h3>No articles found</h3>
              <p>We couldn't find any health articles matching "{searchTerm}". Try checking your spelling or selecting another category.</p>
              <button
                className="articles-catalog__empty-btn"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All Articles')
                }}
              >
                View All Articles
              </button>
            </div>
          )}
        </section>

        {/* Doctor Consultation CTA Banner */}
        <section className="container articles-cta-banner">
          <div className="articles-cta-banner__inner">
            <div className="articles-cta-banner__text">
              <h2>Need personalized advice from top medical specialists?</h2>
              <p>Connect with over 5,000+ verified doctors across 25+ specialties via instant online video or clinic appointments.</p>
            </div>
            <button
              className="articles-cta-banner__btn"
              onClick={() => navigate('/find-doctors')}
            >
              Consult a Doctor Now ➔
            </button>
          </div>
        </section>
      </main>

      {/* Interactive Article Reading Modal */}
      {activeArticle && (
        <ArticleReaderModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}

      <Footer />
    </div>
  )
}

export default ArticlesPage

