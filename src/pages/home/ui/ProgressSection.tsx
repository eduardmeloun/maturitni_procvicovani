import { Button, Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

export function ProgressSection({ onStart }: { onStart: () => void }) {
  return (
    <section className={styles.progressSection}>
      <div className={styles.progressArt} aria-hidden="true">
        <div className={styles.progressCard}>
          <div className={styles.progressHeader}><span className={styles.progressBadge}><Icon name="chart" size={17} /></span><span>Ukázka přehledu přípravy</span><span className={styles.liveDot} /></div>
          <div className={styles.progressPercent}>68<span>%</span></div>
          <p>Jde ti to skvěle. Jen tak dál!</p>
          <div className={styles.progressBar}><span /></div>
          <div className={styles.progressMeta}><span>17 z 25 okruhů</span><strong>+12 % tento týden</strong></div>
        </div>
        <div className={styles.miniBadge}><Icon name="check" size={18} /><span><b>Nový level!</b><small>Level 08 odemčen</small></span></div>
        <div className={styles.artDot} />
      </div>
      <div className={styles.progressCopy}>
        <span className={styles.eyebrow}>Každý krok se počítá</span>
        <h2>Nejen se učit.<br /><span>Vidět, jak rosteš.</span></h2>
        <p>Už žádné „tohle jsem se učil, nebo ne?“. Tvoje výsledky, série i zvládnuté okruhy máš pěkně pohromadě.</p>
        <ul>
          <li><Icon name="check" size={16} /> Jasný přehled zvládnutých otázek</li>
          <li><Icon name="check" size={16} /> Denní série a zkušenostní body</li>
          <li><Icon name="check" size={16} /> Vždy víš, na co se zaměřit dál</li>
        </ul>
        <Button variant="secondary" onClick={onStart}>Mrknout na kartičky <Icon name="arrow" size={17} /></Button>
      </div>
    </section>
  )
}