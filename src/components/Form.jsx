import React from 'react'

/**
 * A reusable Card component for wrapping content, typically forms.
 * @param {{children: React.ReactNode, className?: string} & React.HTMLAttributes<HTMLDivElement>} props
 */
export function Card({ children, className = '', ...props }) {
  const baseStyles = 'w-full rounded-2xl bg-white p-6 shadow'
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * A reusable styled Input component for forms.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props
 */
export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  const baseStyles = 'w-full rounded-xl border p-3'
  return (
    <input className={`${baseStyles} ${className}`} {...props} ref={ref} />
  )
})

/**
 * A reusable styled Title component for forms.
 * @param {{children: React.ReactNode, className?: string} & React.HTMLAttributes<HTMLHeadingElement>} props
 */
export function FormTitle({ children, className = '', ...props }) {
  const baseStyles = 'text-xl font-semibold text-emerald-800'
  return (
    <h1 className={`${baseStyles} ${className}`} {...props}>
      {children}
    </h1>
  )
}

/**
 * A reusable styled component for displaying form field errors.
 * @param {{children: React.ReactNode, className?: string} & React.HTMLAttributes<HTMLParagraphElement>} props
 */
export function ErrorText({ children, className = '', ...props }) {
  const baseStyles = 'text-sm text-red-500'
  return (
    <p className={`${baseStyles} ${className}`} {...props}>
      {children}
    </p>
  )
}