import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import type { AuthMode } from '../../components/layout/AuthModal'
import styles from './HomePage.module.scss'

const features = [
  { icon: 'book' as const, number: '01', title: 'Kartičky, co dávají smysl', body: 'Krátké otázky a jasné odpovědi. Procvičuj po svém a vrať se k tomu, co ještě není úplně jisté.', tone: 'blue' },
  { icon: 'chart' as const, number: '02', title: 'Pokrok, který je vidět', body: 'Sleduj, co už umíš, co chce zopakovat a jak se každý den posouváš blíž k cíli.', tone: 'mint' },
  { icon: 'target' as const, number: '03', title: 'Motivace na každý den', body: 'Sbírej XP, buduj svou sérii a uč se po malých dávkách. Bez zbytečného stresu.', tone: 'peach' },
]

export function HomePage({ onAuth }: { onAuth: (mode: AuthMode) => void }) {
  const [subject, setSubject] = useState('Informační technologie')

  function startLearning() {
    onAuth('register')
  }

  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <span className={styles.pill}><span className={styles.pillDot} /> Maturita bez paniky? Jasně.</span>
          <h1>Velká maturita.<br /><span>Malé kartičky.</span></h1>
          <p className={styles.lead}>Připrav se na maturitu chytře a v klidu. Procvičuj otázky, sleduj svůj pokrok a nech stres za dveřmi.</p>
          <form className={styles.startForm} onSubmit={(event) => { event.preventDefault(); startLearning() }}>
            <label htmlFor="subject">Vyber si svůj obor</label>
            <div className={styles.formRow}>
              <div className={styles.selectWrap}><select id="subject" value={subject} onChange={(event) => setSubject(event.target.value)}><option>Informační technologie</option><option>Elektrotechnika</option><option>Strojírenství</option><option>Jiný maturitní obor</option></select><Icon name="chevron" size={17} /></div>
              <Button type="submit">Chci začít <Icon name="arrow" size={18} /></Button>
            </div>
          </form>
          <div className={styles.socialProof}><div className={styles.avatars}><span>J</span><span>M</span><span>A</span><span><Icon name="users" size={15} /></span></div><p><strong>Uč se vlastním tempem</strong><br />Každá kartička se počítá.</p></div>
        </div>
        <div className={styles.visual} aria-label="Ukázka studijní kartičky" role="img">
          <div className={styles.blob} />
          <div className={`${styles.float} ${styles.floatTop}`}><span><Icon name="sparkle" size={17} /></span> Dnešní cíl splněn!</div>
          <div className={styles.studyCard}>
            <div className={styles.cardTop}><span className={styles.cardTag}>PROGRAMOVÁNÍ</span><span className={styles.cardCount}>04 <i>/ 12</i></span></div>
            <div className={styles.cardProgress}><span /></div>
            <div className={styles.cardBody}><span className={styles.questionLabel}>OTÁZKA</span><h2>Co je to proměnná?</h2><p>Malé zamyšlení a odpověď máš na dosah.</p><div className={styles.answerHint}><span>?</span> Zkus si odpovědět v hlavě</div></div>
            <div className={styles.cardBottom}><span>Pokračovat v učení</span><span className={styles.roundArrow}><Icon name="arrow" size={18} /></span></div>
          </div>
          <div className={`${styles.float} ${styles.floatBottom}`}><span className={styles.streak}>✦</span><div><strong>5 dní</strong><small>tvoje série</small></div></div>
          <span className={`${styles.spark} ${styles.sparkOne}`}>✳</span><span className={`${styles.spark} ${styles.sparkTwo}`}>✦</span>
        </div>
      </div>
      <div className={styles.heroOrnament} />
    </section>

    <section className={styles.trustStrip} aria-label="Výhody aplikace"><div><Icon name="check" size={17} /> Obsah pro maturitní okruhy</div><div><Icon name="check" size={17} /> Pokrok přehledně na jednom místě</div><div><Icon name="check" size={17} /> Krátké učení, velký rozdíl</div></section>

    <section className={styles.features} id="flashcards">
      <div className={styles.sectionHeading}><span className={styles.eyebrow}>Učení, které ti sedne</span><h2>Všechno důležité.<br /><span>Bez zbytečné vědy.</span></h2><p>Od prvního opakování až po poslední maturitní otázku. Tvoje příprava má konečně systém.</p></div>
      <div className={styles.featureGrid}>{features.map((feature) => <article className={styles.featureCard} key={feature.number}><div className={`${styles.featureIcon} ${styles[feature.tone]}`}><Icon name={feature.icon} size={22} /></div><span className={styles.featureNumber}>{feature.number}</span><h3>{feature.title}</h3><p>{feature.body}</p><span className={styles.featureLine} /></article>)}</div>
    </section>

    <section className={styles.progressSection}>
      <div className={styles.progressArt} aria-hidden="true"><div className={styles.progressCard}><div className={styles.progressHeader}><span className={styles.progressBadge}><Icon name="chart" size={17} /></span><span>Tvoje příprava</span><span className={styles.liveDot} /></div><div className={styles.progressPercent}>68<span>%</span></div><p>Jde ti to skvěle. Jen tak dál!</p><div className={styles.progressBar}><span /></div><div className={styles.progressMeta}><span>17 z 25 okruhů</span><strong>+12 % tento týden</strong></div></div><div className={styles.miniBadge}><Icon name="check" size={18} /><span><b>Nový level!</b><small>Level 08 odemčen</small></span></div><div className={styles.artDot} /></div>
      <div className={styles.progressCopy}><span className={styles.eyebrow}>Každý krok se počítá</span><h2>Nejen se učit.<br /><span>Vidět, jak rosteš.</span></h2><p>Už žádné „tohle jsem se učil, nebo ne?“. Tvoje výsledky, série i zvládnuté okruhy máš pěkně pohromadě.</p><ul><li><Icon name="check" size={16} /> Jasný přehled zvládnutých otázek</li><li><Icon name="check" size={16} /> Denní série a zkušenostní body</li><li><Icon name="check" size={16} /> Vždy víš, na co se zaměřit dál</li></ul><Button variant="secondary" onClick={startLearning}>Mrknout na kartičky <Icon name="arrow" size={17} /></Button></div>
    </section>

    <section className={styles.leaderboard} id="leaderboard"><div className={styles.leaderCopy}><span className={styles.eyebrow}>Trocha zdravé motivace</span><h2>Každý den o kousek<br /><span>blíž k cíli.</span></h2><p>Uč se pravidelně, sbírej body a oslavuj každý malý úspěch. Maturita není sprint — ale nemusíš na to být sám.</p><Button onClick={() => onAuth('register')}>Přidat se k učení <Icon name="arrow" size={17} /></Button></div><div className={styles.rankCard}><div className={styles.rankHeading}><div><span className={styles.rankIcon}><Icon name="chart" size={19} /></span><span><strong>Studijní parta</strong><small>Tento týden</small></span></div><span className={styles.rankLabel}>TOP 3</span></div><div className={styles.rankRow}><span className={styles.rankPosition}>01</span><span className={`${styles.avatar} ${styles.avatarBlue}`}>K</span><span className={styles.rankName}>Klára N.<small>4 dny v řadě</small></span><strong>1 280 <small>XP</small></strong></div><div className={styles.rankRow}><span className={styles.rankPosition}>02</span><span className={`${styles.avatar} ${styles.avatarOrange}`}>M</span><span className={styles.rankName}>Matěj S.<small>3 dny v řadě</small></span><strong>1 140 <small>XP</small></strong></div><div className={`${styles.rankRow} ${styles.currentRank}`}><span className={styles.rankPosition}>03</span><span className={`${styles.avatar} ${styles.avatarGreen}`}>T</span><span className={styles.rankName}>Teď jsi na řadě<small>Další můžeš být ty!</small></span><span className={styles.rankArrow}><Icon name="arrow" size={16} /></span></div><p className={styles.rankFoot}><Icon name="sparkle" size={15} /> Tvoje tempo, tvoje cesta.</p></div></section>

    <section className={styles.cta}><div className={styles.ctaIcon}><Icon name="cap" size={27} /></div><span className={styles.eyebrow}>Začni klidně hned</span><h2>Maturita je velká věc.<br /><span>Příprava nemusí být.</span></h2><p>Dej si první kartičku a uvidíš, že to půjde.</p><Button onClick={() => onAuth('register')}>Jdu do toho <Icon name="arrow" size={18} /></Button><span className={styles.ctaStar}>✦</span><span className={styles.ctaDot} /></section>
  </div>
}
