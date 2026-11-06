import type { MouseEventHandler } from 'react'
import { Icon } from './Icon'
import styles from './Brand.module.scss'

export function Brand({ onClick }: { onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <a className={styles.brand} href="/" onClick={onClick} aria-label="Maturyta Formalyta – úvodní stránka">
      <span className={styles.mark}><Icon name="cap" size={23} /></span>
      <span className={styles.name}>maturyta<span>formalyta</span></span>
    </a>
  )
}