import { Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

const features = [
  { icon: 'book', number: '01', title: 'Kartičky, co dávají smysl', body: 'Krátké otázky a jasné odpovědi. Procvičuj po svém a vrať se k tomu, co ještě není úplně jisté.', tone: 'blue' },
  { icon: 'chart', number: '02', title: 'Pokrok, který je vidět', body: 'Sleduj, co už umíš, co chce zopakovat a jak se každý den posouváš blíž k cíli.', tone: 'mint' },
  { icon: 'target', number: '03', title: 'Motivace na každý den', body: 'Sbírej XP, buduj svou sérii a uč se po malých dávkách. Bez zbytečného stresu.', tone: 'peach' },
] as const

export function FeatureSection() {
  return (
    <section className={styles.features} id="flashcards">
      <div className={styles.sectionHeading}>
        <span className={styles.eyebrow}>Učení, které ti sedne</span>
        <h2>Všechno důležité.<br /><span>Bez zbytečné vědy.</span></h2>
        <p>Od prvního opakování až po poslední maturitní otázku. Tvoje příprava má konečně systém.</p>
      </div>
      <div className={styles.featureGrid}>
        {features.map((feature) => (
          <article className={styles.featureCard} key={feature.number}>
            <div className={`${styles.featureIcon} ${styles[feature.tone]}`}><Icon name={feature.icon} size={22} /></div>
            <span className={styles.featureNumber}>{feature.number}</span>
            <h3>{feature.title}</h3><p>{feature.body}</p><span className={styles.featureLine} />
          </article>
        ))}
      </div>
    </section>
  )
}