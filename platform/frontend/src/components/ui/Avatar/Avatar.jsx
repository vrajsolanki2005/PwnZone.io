import * as AvatarPrimitive from '@radix-ui/react-avatar'
import './Avatar.css'

export function Avatar({ className = '', ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={`avatar ${className}`}
      {...props}
    />
  )
}

export function AvatarImage({ className = '', ...props }) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={`avatar-image ${className}`}
      {...props}
    />
  )
}

export function AvatarFallback({ className = '', ...props }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={`avatar-fallback ${className}`}
      {...props}
    />
  )
}
