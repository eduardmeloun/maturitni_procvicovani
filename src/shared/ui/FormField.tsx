import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './FormField.module.scss'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  wrapperClassName?: string
}
type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  wrapperClassName?: string
}

export function InputField({ label, wrapperClassName = '', ...props }: InputFieldProps) {
  return (
    <label className={`${styles.field} ${wrapperClassName}`}>
      <span>{label}</span>
      <input className={styles.control} {...props} />
    </label>
  )
}

export function TextareaField({ label, wrapperClassName = '', ...props }: TextareaFieldProps) {
  return (
    <label className={`${styles.field} ${wrapperClassName}`}>
      <span>{label}</span>
      <textarea className={`${styles.control} ${styles.textarea}`} {...props} />
    </label>
  )
}