import type { Metadata } from 'next'
import { CommunityInviteContent } from '@/components/community-invite-content'
import { parseUserIdInvite } from '@/lib/community-invite'

type PageProps = {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params
  const target = parseUserIdInvite(userId)

  return {
    title: 'Friend invite · IGNITE AI',
    description: 'Open this invite in the IGNITE AI app to send a friend request.',
    openGraph: {
      title: 'Friend invite · IGNITE AI',
      description: 'Open this invite in the IGNITE AI app to send a friend request.',
      url: `https://ignitehub.app/community/add/u/${encodeURIComponent(userId)}`,
      type: 'website',
    },
    robots: { index: false, follow: false },
  }
}

export default async function CommunityAddByUserIdPage({ params }: PageProps) {
  const { userId } = await params
  const target = parseUserIdInvite(userId)

  return <CommunityInviteContent target={target} />
}
