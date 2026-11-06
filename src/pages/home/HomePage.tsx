import type { AuthMode } from '../../features/auth'
import { CallToActionSection } from './ui/CallToActionSection'
import { FeatureSection } from './ui/FeatureSection'
import { HomeHero } from './ui/HomeHero'
import { LeaderboardSection } from './ui/LeaderboardSection'
import { ProgressSection } from './ui/ProgressSection'
import { TrustStrip } from './ui/TrustStrip'
import styles from './HomePage.module.scss'

type Props = { onAuth: (mode: AuthMode) => void }

export function HomePage({ onAuth }: Props) {
  const startLearning = () => onAuth('register')

  return (
    <div className={styles.page}>
      <HomeHero onStart={startLearning} />
      <TrustStrip />
      <FeatureSection />
      <ProgressSection  />
      <LeaderboardSection  />
      <CallToActionSection onStart={startLearning} />
    </div>
  )
}