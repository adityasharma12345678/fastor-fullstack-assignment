import Brand from '../components/Brand.jsx'

export default function AuthLayout({ children, storyTitle, storyCopy, storyEyebrow = 'Good food. Good times.' }) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Brand />
        <span className="auth-top-note">Your table is waiting</span>
      </div>
      <section className="auth-layout">
        <div className="auth-story">
          <div className="story-orbit story-orbit--one" />
          <div className="story-orbit story-orbit--two" />
          <div className="story-content">
            <span className="eyebrow eyebrow--light">{storyEyebrow}</span>
            <h1>{storyTitle}</h1>
            <p>{storyCopy}</p>
            <div className="story-stamp" aria-hidden="true">
              <span>made for</span>
              <strong>food<br />people</strong>
              <span className="stamp-spark">✳</span>
            </div>
          </div>
          <div className="story-caption"><span /> Find your kind of flavour</div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-inner">{children}</div>
        </div>
      </section>
      <footer className="auth-footer"><span>© 2026 Fastor</span><span>Made for moments around the table</span></footer>
    </main>
  )
}
