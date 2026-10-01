import { CopyIcon, DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'

// Style Guide: base components in every state. Dev-only route (`/styleguide`), see routes.tsx.

const ERROR_MESSAGE = 'Mensagem de erro de exemplo.'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 rounded-lg bg-gray-100 p-6 lg:p-8">
      <h2 className="font-bold text-lg">{title}</h2>
      {children}
    </section>
  )
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-xs uppercase">{label}</span>
      {children}
    </div>
  )
}

export function StyleGuide() {
  return (
    <main className="mx-auto flex max-w-[980px] flex-col gap-3 px-3 py-8 lg:gap-5 lg:py-22">
      <h1 className="font-bold text-xl">Style Guide</h1>
      <p className="text-gray-500 text-md">
        Componentes base em todos os estados. Passe o mouse e use Tab para ver hover e foco.
      </p>

      <Section title="Button primary">
        <div className="grid gap-4 lg:grid-cols-2">
          <State label="Padrão (hover e foco interativos)">
            <Button>Salvar link</Button>
          </State>
          <State label="Desabilitado">
            <Button disabled>Salvar link</Button>
          </State>
        </div>
      </Section>

      <Section title="Button secondary">
        <div className="flex flex-wrap gap-8">
          <State label="Padrão">
            <Button variant="secondary" icon={DownloadSimpleIcon}>
              Baixar CSV
            </Button>
          </State>
          <State label="Desabilitado">
            <Button variant="secondary" icon={DownloadSimpleIcon} disabled>
              Baixar CSV
            </Button>
          </State>
        </div>
      </Section>

      <Section title="Icon Button">
        <div className="flex flex-wrap gap-8">
          <State label="Padrão">
            <div className="flex gap-1">
              <IconButton icon={CopyIcon} aria-label="Copiar link" />
              <IconButton icon={TrashIcon} aria-label="Deletar link" />
            </div>
          </State>
          <State label="Desabilitado">
            <div className="flex gap-1">
              <IconButton icon={CopyIcon} aria-label="Copiar link" disabled />
              <IconButton icon={TrashIcon} aria-label="Deletar link" disabled />
            </div>
          </State>
        </div>
      </Section>

      <Section title="Input">
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="link original" placeholder="www.exemplo.com.br" />
          <Input
            label="link original"
            placeholder="www.exemplo.com.br"
            defaultValue="linkedin.com/in/myprofile"
          />
          <Input label="link original" placeholder="www.exemplo.com.br" error={ERROR_MESSAGE} />
          <Input
            label="link original"
            placeholder="www.exemplo.com.br"
            defaultValue="linkedin.com/in/myprofile"
            error={ERROR_MESSAGE}
          />
        </div>
      </Section>

      <Section title="Input com prefixo">
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="link encurtado" prefix="brev.ly/" />
          <Input label="link encurtado" prefix="brev.ly/" defaultValue="Linkedin-Profile" />
          <Input label="link encurtado" prefix="brev.ly/" error={ERROR_MESSAGE} />
          <Input
            label="link encurtado"
            prefix="brev.ly/"
            defaultValue="Linkedin-Profile"
            error={ERROR_MESSAGE}
          />
        </div>
      </Section>
    </main>
  )
}
