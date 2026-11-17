import { Link } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { PublicHeader } from '../../components/PublicHeader/PublicHeader'
import { HeroIllustration } from '../../components/illustrations/HeroIllustration/HeroIllustration'
import { NominateIcon } from '../../components/illustrations/NominateIcon/NominateIcon'
import { ReviewIcon } from '../../components/illustrations/ReviewIcon/ReviewIcon'
import { VoteIcon } from '../../components/illustrations/VoteIcon/VoteIcon'
import { CelebrateIcon } from '../../components/illustrations/CelebrateIcon/CelebrateIcon'
import { StarIcon } from '../../components/illustrations/StarIcon/StarIcon'
import { UssdIcon } from '../../components/illustrations/UssdIcon/UssdIcon'
import { ResultsIcon } from '../../components/illustrations/ResultsIcon/ResultsIcon'
import { PatternBackground } from '../../components/illustrations/PatternBackground/PatternBackground'
import { Button } from '../../components/ui/Button/Button'
import { Card } from '../../components/ui/Card/Card'
import { StepCard } from '../../components/ui/StepCard/StepCard'
import { FeatureCard } from '../../components/ui/FeatureCard/FeatureCard'
import { ImageCard } from '../../components/ui/ImageCard/ImageCard'
import { SectionHeader } from '../../components/ui/SectionHeader/SectionHeader'
import { Accordion } from '../../components/ui/Accordion/Accordion'
import { Reveal } from '../../components/ui/Reveal/Reveal'
import { EVENT_NAME, EVENT_TAGLINE, VOTING_NOTE } from '../../config'
import styles from './HomePage.module.css'

const STEPS = [
  { number: '01', Icon: NominateIcon, title: 'Nominate', text: 'Anyone can nominate a young person, for free, through a short form.' },
  { number: '02', Icon: ReviewIcon, title: 'Review', text: 'The committee checks each nomination before it is published.' },
  { number: '03', Icon: VoteIcon, title: 'Vote', text: 'Everyone votes for approved nominees through the USSD menu.' },
  { number: '04', Icon: CelebrateIcon, title: 'Celebrate', text: 'Winners are announced and celebrated at the awards night.' },
]

const FEATURES = [
  { Icon: NominateIcon, title: 'Nominations are free', text: 'Anyone can submit a nomination at no cost.' },
  { Icon: ReviewIcon, title: 'Every nomination is reviewed', text: 'The committee checks each nomination before it is published.' },
  { Icon: VoteIcon, title: 'Pay by Mobile Money', text: 'Votes are paid through Mobile Money, right from the USSD menu.' },
  { Icon: UssdIcon, title: 'Works without internet', text: 'Voting runs on USSD, so no internet connection is needed.' },
  { Icon: StarIcon, title: 'One code per nominee', text: 'Each approved nominee gets a single unique code for voting.' },
  { Icon: ResultsIcon, title: 'Results after voting closes', text: 'Results are published once the voting period ends.' },
]

const PAYMENT_METHODS = ['MTN MoMo', 'Telecel Cash', 'AT Money']

const FAQ_ITEMS = [
  { question: 'Does it cost anything to nominate someone?', answer: 'No. Nominating someone is completely free.' },
  { question: 'How much does a vote cost?', answer: 'Each vote costs GH₵1.00, paid through Mobile Money.' },
  {
    question: 'Do I need internet access to vote?',
    answer: 'No. Voting runs through the USSD menu, which works on any phone without internet.',
  },
  {
    question: 'What happens after I submit a nomination?',
    answer: 'The committee reviews every nomination before it is approved and published for voting.',
  },
  {
    question: 'When will results be available?',
    answer: 'Results are published after the voting period closes.',
  },
]

export function HomePage() {
  const { categories, loading, error } = useCategories()

  return (
    <div className={styles.page}>
      <PublicHeader />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.heroHeading}>{EVENT_NAME}</h1>
            <p className={styles.heroTagline}>{EVENT_TAGLINE}</p>
            <div className={styles.heroActions}>
              <Button to="/nominate" variant="accent">
                Nominate someone
              </Button>
              <Button to="/nominees" variant="secondary">
                See nominees
              </Button>
            </div>
          </div>
          <div className={styles.heroMedia}>
            {/* Organiser photo goes here: src/assets/images/hero.jpg (see src/assets/images/README.md).
                Falls back to the SVG illustration below when no photo file is present. */}
            <HeroIllustration />
          </div>
        </div>
      </section>

      <Reveal as="section" className={`${styles.section} ${styles.container}`}>
        <div className={styles.pathsGrid}>
          <Card tone="brand" className={styles.pathCard}>
            <span className={styles.pathEyebrow}>Free</span>
            <h2 className={styles.pathHeading}>Nominate someone</h2>
            <p className={styles.pathText}>
              Know a young person who serves, leads or inspires in the parish? Put their name forward in a short form.
            </p>
            <Button to="/nominate" variant="accent">
              Start a nomination
            </Button>
          </Card>
          <Card accentTop className={styles.pathCard}>
            <span className={styles.pathEyebrow}>Paid by Mobile Money</span>
            <h2 className={styles.pathHeading}>Vote for a nominee</h2>
            <p className={styles.pathText}>
              Browse approved nominees, then cast your vote through the USSD menu. One vote, GH₵0.50.
            </p>
            <Button to="/nominees" variant="primary">
              Browse nominees
            </Button>
          </Card>
        </div>
      </Reveal>

      <Reveal as="section" className={`${styles.section} ${styles.container}`}>
        <SectionHeader eyebrow="Process" heading="How it works" support="From nomination to the awards night, in four steps." />
        <div className={styles.stepsGrid}>
          {STEPS.map(({ number, Icon, title, text }) => (
            <StepCard key={title} number={number} icon={<Icon />} title={title} text={text} />
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className={`${styles.section} ${styles.container}`}>
        <SectionHeader eyebrow="Awards" heading="Categories" support="Browse the categories open for nomination and voting." />
        {loading && <p className="page-message">Loading categories…</p>}
        {!loading && error && (
          <p className="page-message">We couldn&apos;t load the categories right now. Please try again shortly.</p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p className="page-message">Categories will be published here soon.</p>
        )}
        {!loading && !error && categories.length > 0 && (
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <ImageCard
                key={category.id}
                title={category.name}
                line={category.description ?? 'See approved nominees in this category.'}
                to="/nominees"
                pattern={<PatternBackground variant={index} />}
              />
            ))}
          </div>
        )}
      </Reveal>

      <Reveal as="section" className={`${styles.section} ${styles.container}`}>
        <SectionHeader eyebrow="Why this works" heading="Built to be simple and fair" align="center" />
        <div className={styles.featuresGrid}>
          {FEATURES.map(({ Icon, title, text }) => (
            <FeatureCard key={title} icon={<Icon />} title={title} text={text} />
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className={`${styles.section} ${styles.container}`}>
        <h2 className={styles.paymentHeading}>Pay with</h2>
        <div className={styles.paymentStrip}>
          {PAYMENT_METHODS.map((method) => (
            <span className={styles.paymentPill} key={method}>
              {method}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className={`${styles.section} ${styles.container}`}>
        <div className={styles.faqGrid}>
          <SectionHeader
            align="left"
            eyebrow="FAQ"
            heading="Questions, answered"
            support="Everything you need to know about nominating and voting."
          />
          <Accordion items={FAQ_ITEMS} />
        </div>
      </Reveal>

      <section className={styles.closingBand}>
        <div className={styles.container}>
          <h2 className={styles.closingHeading}>{VOTING_NOTE}</h2>
          <Button to="/nominate" variant="accent">
            Nominate someone
          </Button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.footerColumn}>
            <p className={styles.footerBrand}>{EVENT_NAME}</p>
            <p className={styles.footerText}>{EVENT_TAGLINE}</p>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Explore</h3>
            <Link to="/nominate" className={styles.footerLink}>
              Nominate
            </Link>
            <Link to="/nominees" className={styles.footerLink}>
              Nominees
            </Link>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Help</h3>
            <p className={styles.footerText}>Need help? Ask any committee member at your parish.</p>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Pay with</h3>
            <div className={styles.footerPayments}>
              {PAYMENT_METHODS.map((method) => (
                <span className={styles.paymentPill} key={method}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} {EVENT_NAME}
        </p>
      </footer>
    </div>
  )
}
