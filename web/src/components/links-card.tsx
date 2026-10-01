import { DownloadSimpleIcon, LinkIcon, WarningIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { linkKeys, listLinks } from '@/api/links'
import { LinkItem } from '@/components/link-item'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

// Empty, loading and error states share the empty state layout from the design.
function ListState({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 border-gray-200 border-t pt-4 pb-6 text-center text-gray-500 text-xs uppercase">
      {children}
    </div>
  )
}

export function LinksCard() {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: linkKeys.all,
    queryFn: listLinks,
  })
  const links = data?.links ?? []

  return (
    <Card
      aria-busy={isPending}
      className="gap-4 p-6 lg:max-h-[calc(100dvh-176px)] lg:w-[580px] lg:shrink-0 lg:gap-5 lg:p-8"
    >
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-lg">Meus links</h2>
        <Button variant="secondary" icon={DownloadSimpleIcon} disabled>
          Baixar CSV
        </Button>
      </header>

      {isPending ? (
        <ListState>
          <Spinner size={32} className="text-gray-400" />
          carregando links...
        </ListState>
      ) : isError ? (
        <ListState>
          <WarningIcon size={32} className="text-danger" />
          não foi possível carregar os links
          <Button
            variant="secondary"
            className="normal-case"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            Tentar novamente
          </Button>
        </ListState>
      ) : links.length === 0 ? (
        <ListState>
          <LinkIcon size={32} className="text-gray-400" />
          ainda não existem links cadastrados
        </ListState>
      ) : (
        // The list scrolls inside the card on desktop; on mobile the page scrolls.
        <ul className="lg:min-h-0 lg:overflow-y-auto">
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </ul>
      )}
    </Card>
  )
}
