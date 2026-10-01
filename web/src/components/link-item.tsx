import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import type { Link } from '@/api/links'
import { IconButton } from '@/components/ui/icon-button'
import { buildShortLink, displayHost, formatAccessCount, stripProtocol } from '@/lib/links'

interface LinkItemProps {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  return (
    <li className="border-gray-200 border-t py-3 last:pb-0 lg:py-4">
      <div className="flex items-center gap-4 py-0.5 lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <a
            href={buildShortLink(link.shortUrl)}
            target="_blank"
            rel="noreferrer"
            className="truncate font-semibold text-blue-base text-md"
          >
            {displayHost}/{link.shortUrl}
          </a>
          <span className="truncate text-gray-500 text-sm">{stripProtocol(link.originalUrl)}</span>
        </div>

        <span className="shrink-0 text-gray-500 text-sm">
          {formatAccessCount(link.accessCount)}
        </span>

        <div className="flex shrink-0 gap-1">
          <IconButton icon={CopyIcon} aria-label={`Copiar link ${link.shortUrl}`} />
          <IconButton icon={TrashIcon} aria-label={`Deletar link ${link.shortUrl}`} />
        </div>
      </div>
    </li>
  )
}
