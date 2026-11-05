import { useState } from 'react'
import { Button, Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

export function HomeHero({ onStart }: { onStart: () => void }) {
  const [subject, setSubject] = useState('Informační technologie')

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <span className={styles.pill}><span className={styles.pillDot} /> Maturita bez paniky? Jasně.</span>
          <h1>Velká maturita.<br /><span>Malé kartičky.</span></h1>
          <p className={styles.lead}>Připrav se na maturitu chytře a v klidu. Procvičuj otázky, sleduj svůj pokrok a nech stres za dveřmi.</p>
          <form className={styles.startForm} onSubmit={(event) => { event.preventDefault(); onStart() }}>
            <label htmlFor="subject">Vyber si svůj obor</label>
            <div className={styles.formRow}>
              <div className={styles.selectWrap}>
                <select id="subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
                  <option>Informační technologie</option><option>Elektrotechnika</option>
                  <option>Strojírenství</option><option>Jiný maturitní obor</option>
                </select>
                <Icon name="chevron" size={17} />
              </div>
              <Button type="submit">Chci začít <Icon name="arrow" size={18} /></Button>
            </div>
          </form>
          <div className={styles.socialProof}>
            <div className={styles.avatars}><span>J</span><span>M</span><span>A</span><span><Icon name="users" size={15} /></span></div>
            <p><strong>Uč se vlastním tempem</strong><br />Každá kartička se počítá.</p>
          </div>
        </div>

        <div className={styles.visual} aria-label="Ukázka studijní kartičky" role="img">
          <div className={styles.blob} />
          <div className={`${styles.float} ${styles.floatTop}`}><span><Icon name="sparkle" size={17} /></span> Dnešní cíl splněn!</div>
          <div className={styles.studyCard}>
            <div className={styles.cardTop}><span className={styles.cardTag}>PROGRAMOVÁNÍ</span><span className={styles.cardCount}>04 <i>/ 12</i></span></div>
            <div className={styles.cardProgress}><span /></div>
            <div className={styles.cardBody}>
              <span className={styles.questionLabel}>OTÁZKA</span>
              <h2>Co je to proměnná?</h2>
              <p>Malé zamyšlení a odpověď máš na dosah.</p>
              <div className={styles.answerHint}><span>?</span> Zkus si odpovědět v hlavě</div>
            </div>
            <div className={styles.cardBottom}><span>Pokračovat v učení</span><span className={styles.roundArrow}><Icon name="arrow" size={18} /></span></div>
          </div>
          <div className={`${styles.float} ${styles.floatBottom}`}>
            <span className={styles.streak}>✦</span><div><strong>5 dní</strong><small>tvoje série</small></div>
          </div>
          <span className={`${styles.spark} ${styles.sparkOne}`}>✳</span>
          <span className={`${styles.spark} ${styles.sparkTwo}`}>✦</span>
        </div>
      </div>
      <div className={styles.heroOrnament} />
    </section>
  )
}