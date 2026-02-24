interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

export function Input({
  name,
  className = '',
  ...props
}: Props) {
  return (
    <input
      name={name}
      className={`bg-transparent border-muted border-2 rounded-sm p-2 w-full ${className}`}
      {...props}
    />
  )
}
