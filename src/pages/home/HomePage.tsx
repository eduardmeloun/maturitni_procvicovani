import { CallToActionSection } from './ui/CallToActionSection'
import { FeatureSection } from './ui/FeatureSection'
import { HomeHero } from './ui/HomeHero'
import { LeaderboardSection } from './ui/LeaderboardSection'
import { ProgressSection } from './ui/ProgressSection'
import { TrustStrip } from './ui/TrustStrip'
import styles from './HomePage.module.scss'

type Props = { onStart: () => void; authenticated: boolean }

export function HomePage({ onStart: startLearning, authenticated }: Props) {

  return (
    <div className={styles.page}>
      <HomeHero onStart={startLearning} />
      <TrustStrip />
      <FeatureSection />
      <ProgressSection  />
      {authenticated && <LeaderboardSection onJoin={startLearning} />}
      <CallToActionSection onStart={startLearning} />
    </div>
  )
}