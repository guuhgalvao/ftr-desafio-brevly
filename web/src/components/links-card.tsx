import { DownloadSimpleIcon, LinkIcon, WarningIcon } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { exportLinks, linkKeys, listLinks } from '@/api/links'
import { LinkItem } from '@/components/link-item'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { getErrorDescription } from '@/lib/error-message'
import { toast } from '@/lib/toast'

// The file is served with `Content-Disposition: attachment`, so the browser downloads it without leaving the page.
function downloadFile(url: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = ''
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}

// Empty, loading and error states share the empty state layout from the design.
// The bottom padding is 28px in the Figma frame, where the divider takes no height; here its 1px is discounted.
function ListState({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 border-gray-200 border-t pt-8 pb-[27px] text-center text-gray-500 text-xs uppercase">
      {children}
    </div>
  )
}

export function LinksCard() {
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: linkKeys.all,
    queryFn: listLinks,
  })
  const links = data?.links ?? []

  const { mutate: exportCsv, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: ({ reportUrl }) => downloadFile(reportUrl),
    onError: (error) => toast.error('Erro ao baixar o CSV', getErrorDescription(error)),
  })

  return (
    <Card
      aria-busy={isPending}
      className="min-h-0 gap-4 p-6 lg:max-h-full lg:min-w-0 lg:flex-1 lg:shrink-0 lg:gap-5 lg:p-8"
    >
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-lg">Meus links</h2>
        <Button
          variant="secondary"
          icon={isExporting ? undefined : DownloadSimpleIcon}
          disabled={links.length === 0 || isExporting}
          onClick={() => exportCsv()}
        >
          {isExporting && <Spinner className="text-gray-600" />}
          Baixar CSV
        </Button>
      </header>

      {isPending ? (
        <ListState>
          <Spinner size={32} className="text-gray-400" />
          carregando links...
        </ListState>
      ) : !data ? (
        // Only without cached data: a failed background refetch keeps showing the last list.
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
        // The card is capped by the viewport (see Home), so a long list scrolls here and not the page.
        <ul className="min-h-0 overflow-y-auto">
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </ul>
      )}
    </Card>
  )
}
