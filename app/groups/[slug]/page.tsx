import type { Metadata } from 'next'
import { GroupInviteContent } from '@/components/group-invite-content'
import { parseGroupInviteSlug } from '@/lib/group-invite'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params
  const target = parseGroupInviteSlug(raw)
  const label =
    target.valid && target.kind === 'handle'
      ? `@${target.handle}`
      : target.valid && target.kind === 'code'
        ? target.code
        : null

  return {
    title: label ? `Join ${label} on IGNITE AI` : 'Group invite · IGNITE AI',
    description: label
      ? `Open IGNITE AI to join ${label}.`
      : 'Open this invite in the IGNITE AI app to join the group.',
    openGraph: {
      title: label ? `Join ${label} on IGNITE AI` : 'Group invite · IGNITE AI',
      description: label
        ? `Open IGNITE AI to join ${label}.`
        : 'Open this invite in the IGNITE AI app to join the group.',
      url: `https://ignitehub.app/groups/${encodeURIComponent(raw)}`,
      type: 'website',
    },
    robots: { index: false, follow: false },
  }
}

export default async function GroupInvitePage({ params }: PageProps) {
  const { slug } = await params
  const target = parseGroupInviteSlug(slug)

  return <GroupInviteContent target={target} />
}
