import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ApiError } from '@/api/errors'
import { createLink, linkKeys } from '@/api/links'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { getErrorDescription } from '@/lib/error-message'
import { displayHost, formMessages, newLinkSchema } from '@/lib/links'
import { toast } from '@/lib/toast'

const ERROR_TITLE = 'Erro no cadastro'

const fieldMessages = {
  originalUrl: formMessages.invalidUrl,
  shortUrl: formMessages.invalidShortUrl,
}

function isField(value: unknown): value is keyof typeof fieldMessages {
  return value === 'originalUrl' || value === 'shortUrl'
}

export function NewLinkForm() {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newLinkSchema),
    defaultValues: { originalUrl: '', shortUrl: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      reset()
      return queryClient.invalidateQueries({ queryKey: linkKeys.all })
    },
    onError: (error) => {
      if (error instanceof ApiError && error.isConflict) {
        setError('shortUrl', { message: formMessages.shortUrlTaken }, { shouldFocus: true })
        toast.error(ERROR_TITLE, formMessages.shortUrlTaken)
        return
      }

      const fields =
        error instanceof ApiError && error.isValidation
          ? (error.issues ?? []).map((issue) => issue.path[0]).filter(isField)
          : []
      if (fields.length === 0) {
        toast.error(ERROR_TITLE, getErrorDescription(error))
        return
      }
      for (const field of fields) {
        setError(field, { message: fieldMessages[field] })
      }
    },
  })

  return (
    <Card className="gap-5 p-6 lg:flex-1 lg:shrink-0 lg:gap-6 lg:p-8">
      <h2 className="font-bold text-lg">Novo link</h2>

      <form
        noValidate
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-5 lg:gap-6"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="link original"
            placeholder="www.exemplo.com.br"
            inputMode="url"
            autoComplete="off"
            readOnly={isPending}
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />
          <Input
            label="link encurtado"
            prefix={`${displayHost}/`}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            readOnly={isPending}
            error={errors.shortUrl?.message}
            {...register('shortUrl')}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Salvando...
            </>
          ) : (
            'Salvar link'
          )}
        </Button>
      </form>
    </Card>
  )
}
