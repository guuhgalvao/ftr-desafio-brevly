import { Link } from 'react-router'
import notFound from '@/assets/not-found.svg'
import { MessageCard } from '@/components/message-card'

export function NotFound() {
  return (
    <MessageCard>
      <img src={notFound} alt="404" className="h-[72px] w-[164px] lg:h-[85px] lg:w-[194px]" />
      <h1 className="font-bold text-xl">Link não encontrado</h1>
      <p className="font-semibold text-gray-500 text-md">
        O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba
        mais em{' '}
        <Link to="/" className="text-blue-base underline">
          brev.ly
        </Link>
        .
      </p>
    </MessageCard>
  )
}
