import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

type Variant = 'primary' | 'secondary' | 'text'
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${styles.button} ${styles[variant]} ${className}`} {...props} />
}

export function LinkButton({ variant = 'primary', className = '', ...props }: LinkButtonProps) {
  return <a className={`${styles.button} ${styles[variant]} ${className}`} {...props} />
}