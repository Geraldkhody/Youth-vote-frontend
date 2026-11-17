import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'accent' | 'danger'

type CommonProps = {
  variant?: Variant
  // Shows a spinner and disables the button -- for actions that call the API.
  loading?: boolean
  loadingLabel?: string
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined }
type ButtonAsLink = CommonProps & LinkProps & { href?: undefined }
type ButtonAsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { to?: undefined }

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const { variant = 'primary', loading = false, loadingLabel = 'Loading', className, children, ...rest } = props
  const classes = `${styles.btn} ${styles[variant]} ${className ?? ''}`.trim()
  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.srOnly : undefined}>{children}</span>
      {loading && <span role="status">{loadingLabel}</span>}
    </>
  )

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as Omit<ButtonAsLink, 'variant' | 'className' | 'loading' | 'loadingLabel' | 'children'>
    return (
      <Link to={to} className={classes} {...linkRest}>
        {children}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const anchorRest = rest as Omit<ButtonAsAnchor, 'variant' | 'className' | 'loading' | 'loadingLabel' | 'children'>
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  const buttonRest = rest as Omit<ButtonAsButton, 'variant' | 'className' | 'loading' | 'loadingLabel' | 'children'>
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} disabled={loading || buttonRest.disabled} {...buttonRest}>
      {content}
    </button>
  )
}
