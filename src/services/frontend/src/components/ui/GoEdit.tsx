import { Link } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'

type Props = {
  isOwner: boolean
  companyId: string
}

export function GoEdit({ companyId, isOwner }: Props) {
  if (!isOwner) return null
  return (
    <div className="sticky bottom-0 inset-x-0 z-50 flex justify-end pb-5">
      <Link
        to="/edit/$companyId"
        params={{ companyId }}
        className="bg-primary text-white z-50 mr-5 rounded-full p-2"
      >
        <Pencil className="size-8" />
      </Link>
    </div>
  )
}
