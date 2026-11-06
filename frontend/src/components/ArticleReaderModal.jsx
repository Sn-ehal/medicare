import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArticleReaderModal.css'

const ArticleReaderModal = ({ article, onClose }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!article) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [article, onClose])

  if (!article) return null

  const handleConsultDoctor = (query) => {
    onClose()
    navigate(`/video-consult?specialty=${encodeURIComponent(query || 'General Physician')}`)
  }

  return (
    <div className="article-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="article-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="article-modal__header">
          <div className="article-modal__badges">
            <span className="article-modal__category">{article.category}</span>
            <span className="article-modal__dot">•</span>
            <span className="article-modal__readtime">{article.readTime}</span>
            <span className="article-modal__dot">•</span>
            <span className="article-modal__date">{article.date}</span>
          </div>
          <button
            className="article-modal__close-btn"
            onClick={onClose}
            aria-label="Close article modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="article-modal__content">
          <h1 className="article-modal__title">{article.title}</h1>

          {/* Author Doctor Card */}
          <div className="article-modal__author-strip">
            <div className="article-modal__author-left">
              <div className="article-modal__author-avatar">
                👨‍⚕️
              </div>
              <div className="article-modal__author-info">
                <div className="article-modal__author-name">
                  Verified by <strong>{article.author}</strong>
                </div>
                <div className="article-modal__author-role">
                  {article.authorRole}
                </div>
              </div>
            </div>

            <button
              className="article-modal__consult-btn"
              onClick={() => handleConsultDoctor(article.doctorQuery)}
            >
              Consult Doctor ➔
            </button>
          </div>

          {/* Featured Image Banner */}
          <div className="article-modal__image-wrap">
            <img
              src={article.image}
              alt={article.title}
              className="article-modal__img"
            />
          </div>

          {/* Article Summary Box */}
          {article.summary && (
            <div className="article-modal__summary-callout">
              <strong>Quick Summary:</strong> {article.summary}
            </div>
          )}

          {/* Body Sections */}
          <div className="article-modal__body">
            {article.sections && article.sections.map((sec, idx) => (
              <section key={idx} className="article-modal__section">
                {sec.heading && <h2 className="article-modal__section-heading">{sec.heading}</h2>}

                {sec.paragraphs && sec.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="article-modal__paragraph">{para}</p>
                ))}

                {sec.keyTakeaways && (
                  <div className="article-modal__takeaways-box">
                    <h3 className="article-modal__takeaways-title">
                      <span className="article-modal__takeaways-icon">💡</span>
                      Doctor's Key Advice & Action Items
                    </h3>
                    <ul className="article-modal__takeaways-list">
                      {sec.keyTakeaways.map((item, tIdx) => (
                        <li key={tIdx} className="article-modal__takeaways-item">
                          <span className="article-modal__check-icon">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="article-modal__footer-cta">
            <div className="article-modal__cta-text">
              <h3>Have questions about this health topic?</h3>
              <p>Consult with {article.author} or other verified Medicare specialists for tailored medical advice.</p>
            </div>
            <div className="article-modal__cta-actions">
              <button
                className="article-modal__consult-btn article-modal__consult-btn--large"
                onClick={() => handleConsultDoctor(article.doctorQuery)}
              >
                Book Consultation Now
              </button>
              <button
                className="article-modal__back-btn"
                onClick={onClose}
              >
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleReaderModal

