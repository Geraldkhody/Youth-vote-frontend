import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { PublicHeader } from '../components/PublicHeader'
import { HeroIllustration } from '../components/illustrations/HeroIllustration'
import { NominateIcon } from '../components/illustrations/NominateIcon'
import { ReviewIcon } from '../components/illustrations/ReviewIcon'
import { VoteIcon } from '../components/illustrations/VoteIcon'
import { CelebrateIcon } from '../components/illustrations/CelebrateIcon'
import { StarIcon } from '../components/illustrations/StarIcon'
import { EVENT_NAME, EVENT_TAGLINE, VOTING_NOTE } from '../config'

const STEPS = [
  { Icon: NominateIcon, title: 'Nominate', text: 'Anyone can nominate a young person, for free, through a short form.' },
  { Icon: ReviewIcon, title: 'Review', text: 'The committee checks each nomination before it is published.' },
  { Icon: VoteIcon, title: 'Vote', text: 'Everyone votes for approved nominees through the USSD menu, paid by Mobile Money.' },
  { Icon: CelebrateIcon, title: 'Celebrate', text: 'Winners are announced and celebrated at the awards night.' },
]

export function HomePage() {
  const { categories, loading, error } = useCategories()

  return (
    <div>
      <PublicHeader />

      <section className="hero">
        <div className="hero__text">
          <h1>{EVENT_NAME}</h1>
          <p className="hero__tagline">{EVENT_TAGLINE}</p>
          <Link to="/nominate" className="btn btn-primary">
            Nominate someone
          </Link>
        </div>
        <div className="hero__illustration">
          <HeroIllustration />
        </div>
      </section>

      <section className="page section">
        <h2>How it works</h2>
        <div className="steps-grid">
          {STEPS.map(({ Icon, title, text }) => (
            <div className="step-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page section">
        <h2>Award categories</h2>
        {loading && <p className="page-message">Loading categories…</p>}
        {!loading && error && (
          <p className="page-message">We couldn&apos;t load the categories right now. Please try again shortly.</p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p className="page-message">Categories will be published here soon.</p>
        )}
        {!loading && !error && categories.length > 0 && (
          <div className="category-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.id}>
                <StarIcon />
                <h3>{category.name}</h3>
                {category.description && <p>{category.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="page section voting-note">
        <h2>Voting</h2>
        <p>{VOTING_NOTE}</p>
      </section>

      <footer className="public-footer">
        <div className="page public-footer__inner">
          <Link to="/nominate" className="btn btn-primary">
            Nominate someone
          </Link>
          <p>Need help? Ask any committee member at your parish.</p>
        </div>
      </footer>
    </div>
  )
}
