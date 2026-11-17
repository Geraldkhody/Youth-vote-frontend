import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'accent'

type CommonProps = {
  variant?: Variant
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined }
type ButtonAsLink = CommonProps & LinkProps & { href?: undefined }
type ButtonAsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { to?: undefined }

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const { variant = 'primary', className, ...rest } = props
  const classes = `${styles.btn} ${styles[variant]} ${className ?? ''}`.trim()

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as Omit<ButtonAsLink, 'variant' | 'className'>
    return <Link to={to} className={classes} {...linkRest} />
  }

  if ('href' in rest && rest.href !== undefined) {
    const anchorRest = rest as Omit<ButtonAsAnchor, 'variant' | 'className'>
    return <a className={classes} {...anchorRest} />
  }

  const buttonRest = rest as Omit<ButtonAsButton, 'variant' | 'className'>
  return <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest} />
}
