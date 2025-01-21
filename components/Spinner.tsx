import { PulseLoader } from "react-spinners"

interface SpinnerProps {
  size?: number
  color?: string
}

export function Spinner({ size = 10, color = "#000000" }: SpinnerProps) {
  return <PulseLoader size={size} color={color} />
}

