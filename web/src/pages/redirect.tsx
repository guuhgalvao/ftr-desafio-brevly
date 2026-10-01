import { WarningIcon } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { ApiError } from '@/api/errors'
import { getLinkByShortUrl, incrementLinkAccess, type Link, linkKeys } from '@/api/links'
import logoIcon from '@/assets/logo-icon.svg'
import { MessageCard } from '@/components/message-card'
import { Button } from '@/components/ui/button'
import { getErrorDescription } from '@/lib/error-message'
import { NotFound } from '@/pages/not-found'

// The API only stores http(s) URLs; anything else (e.g. `javascript:`) is never followed.
function isSafeUrl(url: string) {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}

export function Redirect() {
  const { shortUrl = '' } = useParams()

  // Fetched once per visit: a refetch would not redirect again, it would only risk a new increment.
  const {
    data: link,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [...linkKeys.all, shortUrl],
    queryFn: () => getLinkByShortUrl(shortUrl),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // `onSettled` lives here (not on `mutate`) so it runs on success and on failure: a failed count never blocks the redirect.
  const { mutate: registerAccess } = useMutation({
    mutationFn: ({ id }: Link) => incrementLinkAccess(id),
    onSettled: (_data, _error, { originalUrl }) => window.location.replace(originalUrl),
  })

  const destination = link && isSafeUrl(link.originalUrl) ? link : undefined

  // The ref survives the StrictMode double effect run, so the access is counted only once.
  const hasStarted = useRef(false)
  useEffect(() => {
    if (!destination || hasStarted.current) {
      return
    }
    hasStarted.current = true
    registerAccess(destination)
  }, [destination, registerAccess])

  if ((link && !destination) || (error instanceof ApiError && error.isNotFound)) {
    return <NotFound />
  }

  if (error && !link) {
    return (
      <MessageCard>
        <WarningIcon size={32} className="text-danger" />
        <h1 className="font-bold text-xl">Não foi possível redirecionar</h1>
        <p className="font-semibold text-gray-500 text-md">{getErrorDescription(error)}</p>
        <Button variant="secondary" disabled={isFetching} onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </MessageCard>
    )
  }

  return (
    <MessageCard aria-busy>
      <img src={logoIcon} alt="" className="size-12" />
      <h1 className="font-bold text-xl">Redirecionando...</h1>
      <div className="flex flex-col gap-1 font-semibold text-gray-500 text-md">
        <p>O link será aberto automaticamente em alguns instantes.</p>
        <p>
          Não foi redirecionado?{' '}
          {/* Without `href` until the link is loaded, to keep the layout still. */}
          <a href={destination?.originalUrl} className="text-blue-base underline">
            Acesse aqui
          </a>
        </p>
      </div>
    </MessageCard>
  )
}
