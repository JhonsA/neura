import { User } from 'lucide-react'

function AvatarButton() {
  return (
    <button className="neura-avatar-btn" type="button" aria-label="Perfil de usuario">
      <User size={16} strokeWidth={1.6} />
    </button>
  )
}

export default AvatarButton
