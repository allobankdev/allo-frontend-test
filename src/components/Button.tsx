import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
    textColor?: string
    bgColor?: string
}

const Button = ({
    label,
    textColor = 'text-white',
    bgColor = 'bg-blue-500',
    className = '',
    ...props
}: ButtonProps) => {
    return (
        <button className={`${textColor} ${bgColor} ${className}`} {...props}>
            {label}
        </button>
    )
}

export default Button
