import { CallToActionSection } from './ui/CallToActionSection'
import { FeatureSection } from './ui/FeatureSection'
import { HomeHero } from './ui/HomeHero'
import { LeaderboardSection } from './ui/LeaderboardSection'
import { ProgressSection } from './ui/ProgressSection'
import { TrustStrip } from './ui/TrustStrip'
import styles from './HomePage.module.scss'

type Props = { onStart: () => void }

export function HomePage({ onStart: startLearning }: Props) {

  return (
    <div className={styles.page}>
      <HomeHero onStart={startLearning} />
      <TrustStrip />
      <FeatureSection />
      <ProgressSection onStart={startLearning} />
      <LeaderboardSection onJoin={startLearning} />
      <CallToActionSection onStart={startLearning} />
    </div>
  )
}