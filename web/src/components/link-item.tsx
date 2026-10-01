import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/api/errors'
import { deleteLink, type Link, linkKeys } from '@/api/links'
import { IconButton } from '@/components/ui/icon-button'
import { getErrorDescription } from '@/lib/error-message'
import { buildShortLink, formatAccessCount, frontendHost, stripProtocol } from '@/lib/links'
import { toast } from '@/lib/toast'

interface LinkItemProps {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  const queryClient = useQueryClient()
  const shortLink = buildShortLink(link.shortUrl)

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLink(link.id),
    // Returning the promise keeps the button disabled until the refreshed list arrives.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linkKeys.all }),
    onError: (error) => {
      // Already deleted elsewhere: the list is just stale.
      if (error instanceof ApiError && error.isNotFound) {
        return queryClient.invalidateQueries({ queryKey: linkKeys.all })
      }
      toast.error('Erro ao deletar', getErrorDescription(error))
    },
  })

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortLink)
      toast.info(
        'Link copiado com sucesso',
        `O link ${link.shortUrl} foi copiado para a área de transferência.`,
      )
    } catch {
      toast.error('Erro ao copiar', 'Não foi possível copiar o link.')
    }
  }

  function handleDelete() {
    if (window.confirm(`Você realmente quer apagar o link ${link.shortUrl}?`)) {
      remove()
    }
  }

  return (
    <li className="not-first:-mt-px border-gray-200 border-t py-3 last:pb-0 lg:py-4 lg:last:pb-0">
      <div className="flex items-center gap-4 py-0.5 lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <a
            href={shortLink}
            target="_blank"
            rel="noreferrer"
            className="truncate font-semibold text-blue-base text-md"
          >
            {frontendHost}/{link.shortUrl}
          </a>
          <span className="truncate text-gray-500 text-sm">{stripProtocol(link.originalUrl)}</span>
        </div>

        <span className="shrink-0 text-gray-500 text-sm">
          {formatAccessCount(link.accessCount)}
        </span>

        <div className="flex shrink-0 gap-1">
          <IconButton
            icon={CopyIcon}
            aria-label={`Copiar link ${link.shortUrl}`}
            onClick={handleCopy}
          />
          <IconButton
            icon={TrashIcon}
            aria-label={`Deletar link ${link.shortUrl}`}
            disabled={isDeleting}
            onClick={handleDelete}
          />
        </div>
      </div>
    </li>
  )
}
