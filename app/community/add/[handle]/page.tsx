import type { Metadata } from 'next'
import { CommunityInviteContent } from '@/components/community-invite-content'
import { parseHandleInvite } from '@/lib/community-invite'

type PageProps = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle: raw } = await params
  const target = parseHandleInvite(raw)
  const label = target.valid ? `@${target.handle}` : null

  return {
    title: label ? `Add ${label} on IGNITE AI` : 'Friend invite · IGNITE AI',
    description: label
      ? `Open IGNITE AI to add ${label} as a friend.`
      : 'Open this invite in the IGNITE AI app to send a friend request.',
    openGraph: {
      title: label ? `Add ${label} on IGNITE AI` : 'Friend invite · IGNITE AI',
      description: label
        ? `Open IGNITE AI to add ${label} as a friend.`
        : 'Open this invite in the IGNITE AI app to send a friend request.',
      url: `https://ignitehub.app/community/add/${encodeURIComponent(raw)}`,
      type: 'website',
    },
    robots: { index: false, follow: false },
  }
}

export default async function CommunityAddByHandlePage({ params }: PageProps) {
  const { handle } = await params
  const target = parseHandleInvite(handle)

  return <CommunityInviteContent target={target} />
}
