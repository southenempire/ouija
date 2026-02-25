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
      className={`bg-muted font-pixel text-xl border-4 border-muted-light focus:border-accent outline-none rounded-none p-3 w-full text-white transition-colors placeholder:text-zinc-600 ${className}`}
      {...props}
    />
  )
}
