import { ContactForm } from './components/ContactForm'
import { Header } from './components/Header'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        title="Formularz kontaktowy"
        subtitle="Napisz do nas – odpowiadamy zwykle w ciągu jednego dnia roboczego."
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-14">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Contact Form Automation App
        </div>
      </footer>
    </div>
  )
}
