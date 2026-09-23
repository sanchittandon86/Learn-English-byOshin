'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { z } from 'zod'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Headphones,
  Home,
  Lightbulb,
  Loader2,
  Menu,
  Mic,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ADMIN_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

const bookingSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name.'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit WhatsApp number.'),
  consent: z.literal(true, { error: "Please confirm you're okay being contacted." }),
})

const services = [
  { icon: Headphones, text: 'Online IELTS, PTE, Duolingo & TOEFL classes available' },
  { icon: Mic, text: 'Spoken English & personality development classes' },
  { icon: Home, text: 'Customized special classes for housewives' },
  { icon: Lightbulb, text: 'Skill development classes for kids, age 4+ years onwards' },
  { icon: Briefcase, text: 'Professional interview preparation' },
  { icon: GraduationCap, text: 'Interview preparation for study abroad (Canada, New Zealand, USA, UK, Australia)' },
]

const testimonials = [
  { name: 'Sofia Martinez', country: 'Spain', flag: '🇪🇸', quote: 'I finally feel comfortable speaking up in meetings. The lessons are practical, warm, and never overwhelming.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80' },
  { name: 'Kenji Tanaka', country: 'Japan', flag: '🇯🇵', quote: 'The placement test pointed me to exactly the right course. I noticed a difference in my conversations after week one.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' },
  { name: 'Amara Okafor', country: 'Nigeria', flag: '🇳🇬', quote: 'My teacher makes every session feel personal. English Learning Course gives me confidence, not just grammar.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80' },
]

const heroSlides = ['/logo.jpeg', '/promo-2.jpeg']

const dailyWords = [
  { word: 'Articulate', meaning: 'Able to express ideas clearly and effectively.', example: 'She gave an articulate answer during the interview.' },
  { word: 'Candid', meaning: 'Truthful and straightforward; frank.', example: 'He was candid about the challenges of learning a new language.' },
  { word: 'Diligent', meaning: 'Showing care and effort in your work or duties.', example: 'Diligent practice is the fastest way to improve your English.' },
  { word: 'Eloquent', meaning: 'Fluent and persuasive in speaking or writing.', example: 'Her eloquent speech impressed the entire audience.' },
  { word: 'Fluent', meaning: 'Able to speak or write smoothly and easily.', example: 'After a year of classes, he became fluent in English.' },
  { word: 'Gracious', meaning: 'Courteous, kind, and pleasant.', example: 'The host was gracious to all of her guests.' },
  { word: 'Humble', meaning: 'Not proud; modest about one’s abilities.', example: 'Despite her success, she remained humble.' },
  { word: 'Insightful', meaning: 'Showing a clear, deep understanding of something.', example: 'The teacher gave an insightful explanation of the grammar rule.' },
  { word: 'Jovial', meaning: 'Cheerful and friendly.', example: 'The jovial atmosphere made the class enjoyable.' },
  { word: 'Keen', meaning: 'Having a strong interest or enthusiasm.', example: 'She is keen to improve her pronunciation.' },
  { word: 'Meticulous', meaning: 'Very careful and precise about details.', example: 'He is meticulous when correcting his own writing.' },
  { word: 'Nurture', meaning: 'To care for and encourage growth or development.', example: 'Good teachers nurture confidence in their students.' },
  { word: 'Optimistic', meaning: 'Hopeful and confident about the future.', example: 'Stay optimistic — fluency comes with consistent practice.' },
  { word: 'Persevere', meaning: 'To continue trying despite difficulty.', example: 'Persevere with your studies, even when English feels hard.' },
  { word: 'Resilient', meaning: 'Able to recover quickly from setbacks.', example: 'A resilient learner keeps practicing after making mistakes.' },
  { word: 'Sincere', meaning: 'Genuine and honest.', example: 'He gave a sincere thank-you to his teacher.' },
  { word: 'Thoughtful', meaning: 'Showing consideration and careful thinking.', example: 'She wrote a thoughtful response to the question.' },
  { word: 'Versatile', meaning: 'Able to adapt to many different situations.', example: 'A versatile vocabulary helps in every conversation.' },
  { word: 'Vivid', meaning: 'Producing clear, powerful images in the mind.', example: 'He gave a vivid description of his hometown.' },
  { word: 'Wholehearted', meaning: 'Completely sincere and enthusiastic.', example: 'She gave her wholehearted effort to every lesson.' },
]

function getWordOfTheDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return dailyWords[dayOfYear % dailyWords.length]
}

export function LearningLanding() {
  const todayWord = getWordOfTheDay()
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0)

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const id = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  function resetBookingForm() {
    setBookingStatus('idle')
    setFullName('')
    setPhone('')
    setConsent(false)
    setFieldErrors({})
  }

  function handleBookingOpenChange(open: boolean) {
    setBookingOpen(open)
    if (!open) resetBookingForm()
  }

  function handleBookingSubmit(e: FormEvent) {
    e.preventDefault()
    const result = bookingSchema.safeParse({ fullName, phone, consent })
    if (!result.success) {
      const flattened = z.flattenError(result.error).fieldErrors
      setFieldErrors({
        fullName: flattened.fullName?.[0] ?? '',
        phone: flattened.phone?.[0] ?? '',
        consent: flattened.consent?.[0] ?? '',
      })
      return
    }
    setFieldErrors({})
    setBookingStatus('submitting')

    const formattedPhone = `${result.data.phone.slice(0, 5)} ${result.data.phone.slice(5)}`
    const message = `New Session Booking Request\n\nHi, you have a new request for an English Learning session.\n\nStudent Details\n Name: ${result.data.fullName}\n Phone: +91 ${formattedPhone}\n Session: English Learning\n\nPlease reach out to the student to discuss availability and confirm the session.`
    const encodedMessage = encodeURIComponent(message)
    const waAppUrl = `whatsapp://send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodedMessage}`
    const waWebUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`

    // Try the native app first: whatsapp:// isn't a real web URL, so setting
    // location.href to it hands off to the OS without navigating this page
    // away (no stray browser tab). Fall back to the web link only if the app
    // doesn't pick it up (desktop, or WhatsApp not installed) — detected via
    // whether the tab actually got backgrounded shortly after.
    let appOpened = false
    const onVisibilityChange = () => {
      if (document.hidden) appOpened = true
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.location.href = waAppUrl

    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (!appOpened) window.location.href = waWebUrl
    }, 1500)

    setTimeout(() => {
      setBookingStatus('success')
    }, 10000)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-brand-surface text-[#172b4d]">
      <header className="fixed inset-x-0 top-0 z-50 bg-brand-dark shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight text-white"><span className="grid size-9 place-items-center rounded-lg bg-brand-primary text-sm font-bold text-white">LeT</span><span>Learn English <span className="text-brand-accent-light">Today</span></span></a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#9fb3c7] md:flex"><a href="#services" className="relative pb-1 transition after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-accent-light-alt after:transition-all after:duration-300 hover:text-white hover:after:w-full">Services</a><a href="#teachers" className="relative pb-1 transition after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-accent-light-alt after:transition-all after:duration-300 hover:text-white hover:after:w-full">Teacher</a><a href="#stories" className="relative pb-1 transition after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-accent-light-alt after:transition-all after:duration-300 hover:text-white hover:after:w-full">Stories</a></nav>
          <Button onClick={() => setBookingOpen(true)} className="hidden h-10 rounded-xl bg-brand-primary px-5 hover:bg-brand-accent-strong md:inline-flex">Book a demo <ArrowRight data-icon="inline-end" /></Button>
          <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-white md:hidden">{menuOpen ? <X /> : <Menu />}</button>
          <div onClick={() => setMenuOpen(false)} aria-hidden="true" className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
          <div className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col bg-brand-dark p-6 shadow-2xl transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 text-white"><X /></button>
            </div>
            <nav className="flex flex-col gap-1">
              <a href="#services" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-[#9fb3c7] transition hover:bg-white/5 hover:text-white">Services</a>
              <a href="#teachers" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-[#9fb3c7] transition hover:bg-white/5 hover:text-white">Teacher</a>
              <a href="#stories" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-[#9fb3c7] transition hover:bg-white/5 hover:text-white">Stories</a>
            </nav>
            <Button className="mt-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover" onClick={() => { setMenuOpen(false); setBookingOpen(true) }}>Book a demo</Button>
          </div>
        </div>
      </header>

      <main id="top" className="pt-20">
        <section className="bg-brand-tint"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div><div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-accent-soft px-3 py-1.5 text-xs font-semibold text-brand-accent-strong"><Sparkles className="size-3.5" /> Learn at your own pace</div><h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-brand-heading sm:text-6xl">Master English <span className="text-brand-accent">with confidence.</span></h1><p className="mt-6 max-w-lg text-lg leading-8 text-brand-muted">Practical English lessons that fit your life. Build real-world fluency, find your voice, and enjoy every step of the journey.</p><div className="mt-8 flex flex-wrap gap-3"><span className="relative inline-flex"><span className="absolute inset-0 motion-safe:animate-ping rounded-xl bg-brand-primary/40" /><Button onClick={() => setBookingOpen(true)} className="relative h-12 rounded-xl bg-brand-primary px-6 hover:bg-brand-primary-hover">Book a demo session <ArrowRight data-icon="inline-end" /></Button></span></div><div className="mt-9 flex items-center gap-4 text-sm text-[#718096]"><div className="flex -space-x-2">{testimonials.map((item) => <img key={item.name} src={item.image} alt="" className="size-8 rounded-full border-2 border-white object-cover" />)}</div><span><strong className="text-brand-primary">1,000+</strong> happy learners</span></div></div>
          <div className="relative"><div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#edf6ff] blur-2xl" /><div className="motion-safe:animate-float relative aspect-[1.12] overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(50,90,110,0.14)]">{heroSlides.map((src, index) => <img key={src} src={src} alt="Learn English Today with Oshin Suri" className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out ${index === heroSlideIndex ? 'opacity-100' : 'opacity-0'}`} />)}</div></div>
        </div></section>

        <section id="services" className="scroll-mt-20 border-y border-brand-border-soft bg-white py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-10"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">What we offer</p><h2 className="text-2xl font-semibold tracking-tight text-brand-heading sm:text-3xl">Services offered.</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map((item) => <div key={item.text} className="motion-safe:animate-orbit group flex items-start gap-4 rounded-2xl border border-brand-border-card bg-brand-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-accent-soft text-brand-accent"><item.icon className="size-5" /></span><p className="pt-1.5 text-sm font-medium leading-6 text-brand-text-strong">{item.text}</p></div>)}</div></div></section>

        <section id="teachers" className="scroll-mt-20 bg-brand-tint py-20"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"><div className="relative mx-auto w-full max-w-sm"><div className="absolute -inset-3 rounded-[28px] border border-[#c7d9ec]" /><img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=85" alt="Oshin Suri, English teacher" className="relative aspect-[0.85] w-full rounded-[24px] object-cover" /><div className="absolute -bottom-5 -right-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg"><span className="grid size-9 place-items-center rounded-full bg-brand-accent-soft text-brand-accent"><ShieldCheck className="size-5" /></span><div><p className="text-xs text-brand-faint">Verified teacher</p><p className="text-sm font-semibold text-brand-primary">5+ years experience</p></div></div></div><div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">Meet your guide</p><h2 className="text-2xl font-semibold tracking-tight text-brand-heading sm:text-3xl">Learn with someone who gets it.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-[#637b83]">“My goal is to make English feel less like a subject and more like a superpower you can use every day.”</p><div className="mt-7 flex items-center gap-4"><div><p className="font-semibold text-brand-heading-soft">Oshin Suri</p><p className="text-sm text-[#71868d]">CELTA-certified · Business English</p></div><div className="ml-2 flex gap-2"><span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-brand-accent shadow-sm">TEFL</span><span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-brand-accent shadow-sm">CELTA</span></div></div><Button onClick={() => setBookingOpen(true)} className="mt-8 rounded-xl bg-brand-primary hover:bg-brand-primary-hover">Book a 1-on-1 session <ArrowRight data-icon="inline-end" /></Button></div></div></section>

        <section id="stories" className="scroll-mt-20 border-t border-brand-border-soft bg-white py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">Learner stories</p><h2 className="text-2xl font-semibold tracking-tight text-brand-heading sm:text-3xl">Small steps. Big confidence.</h2></div><div className="relative mt-10 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"><div className="motion-safe:animate-marquee flex w-max gap-4 px-5 lg:px-8">{[...testimonials, ...testimonials].map((item, index) => <article key={`${item.name}-${index}`} className="w-[320px] shrink-0 rounded-2xl border border-brand-border-card bg-brand-surface p-6"><div className="flex items-center gap-3"><img src={item.image} alt={item.name} className="size-11 rounded-full object-cover" /><div><p className="font-semibold text-brand-heading-soft">{item.name}</p><p className="text-xs text-brand-faint">{item.flag} {item.country}</p></div><div className="ml-auto flex text-[#e7ad54]">{[1,2,3,4,5].map((star) => <Star key={star} className="size-3.5 fill-current" />)}</div></div><Quote className="mt-6 size-6 text-[#6f9ecb]" /><p className="mt-3 leading-7 text-[#5f7586]">{item.quote}</p></article>)}</div></div></section>
      </main>

      <Dialog open={bookingOpen} onOpenChange={handleBookingOpenChange}>
        <DialogContent className="rounded-2xl border border-[#e4ebf1] p-0 ring-0 shadow-2xl sm:max-w-md">
          {bookingStatus === 'success' ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-brand-accent-soft text-brand-primary"><CheckCircle2 className="size-7" /></span>
              <div>
                <p className="text-lg font-semibold text-brand-heading">Almost done!</p>
                <p className="mt-1.5 text-sm text-brand-muted">We&apos;ve opened WhatsApp with your details — just tap Send to complete your request.</p>
              </div>
              <Button onClick={() => handleBookingOpenChange(false)} className="mt-2 w-full rounded-xl bg-brand-primary hover:bg-brand-primary-hover">Done</Button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-7">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-brand-heading">Book a Free Demo Session</DialogTitle>
                <DialogDescription className="text-brand-muted">Share your details and we&apos;ll reach out on WhatsApp to confirm a time that works for you.</DialogDescription>
              </DialogHeader>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="booking-name" className="text-brand-text-strong">Full name</Label>
                  <Input
                    id="booking-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    aria-invalid={!!fieldErrors.fullName}
                    aria-describedby={fieldErrors.fullName ? 'booking-name-error' : undefined}
                    className="h-11 rounded-lg border-brand-border-input focus-visible:border-brand-accent focus-visible:ring-brand-accent/20"
                  />
                  {fieldErrors.fullName && <p id="booking-name-error" className="text-xs text-red-600">{fieldErrors.fullName}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="booking-phone" className="text-brand-text-strong">WhatsApp number</Label>
                  <div className={`flex h-11 items-center rounded-lg border bg-transparent transition-colors focus-within:border-brand-accent focus-within:ring-3 focus-within:ring-brand-accent/20 ${fieldErrors.phone ? 'border-red-400' : 'border-brand-border-input'}`}>
                    <span className="pl-3 pr-1 text-sm font-medium text-brand-muted">+91</span>
                    <Input
                      id="booking-phone"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'booking-phone-error' : undefined}
                      className="h-full flex-1 border-0 pl-1 focus-visible:ring-0"
                    />
                  </div>
                  {fieldErrors.phone && <p id="booking-phone-error" className="text-xs text-red-600">{fieldErrors.phone}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-start gap-2.5 text-sm text-[#526a7b]">
                    <Checkbox
                      checked={consent}
                      onCheckedChange={(value) => setConsent(value)}
                      aria-invalid={!!fieldErrors.consent}
                      className="mt-0.5 border-[#c7d3de] data-checked:border-brand-primary data-checked:bg-brand-primary"
                    />
                    I agree to be contacted on WhatsApp regarding this request.
                  </label>
                  {fieldErrors.consent && <p className="text-xs text-red-600">{fieldErrors.consent}</p>}
                </div>

                <Button type="submit" disabled={bookingStatus === 'submitting'} className="h-12 w-full rounded-xl bg-brand-primary hover:bg-brand-primary-hover">
                  {bookingStatus === 'submitting' ? <><Loader2 className="size-4 animate-spin" /> Sending...</> : 'Book my free session'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <footer className="relative overflow-hidden bg-brand-dark text-white"><img src="/logo.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[85vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.18] [mask-image:radial-gradient(closest-side,black,transparent)] sm:max-w-[520px] lg:max-w-[640px]" /><div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-5 py-14 lg:flex-row lg:items-start lg:justify-between lg:px-8"><div className="order-2 lg:max-w-sm"><p className="text-lg font-semibold tracking-tight">Learn English <span className="text-brand-accent-light">Today</span></p><p className="mt-5 max-w-xs text-sm leading-6 text-brand-dark-body">Good English opens doors. We&apos;re here to help you walk through them.</p><div className="mt-6 flex gap-3 text-brand-dark-caption"><a href="https://www.instagram.com/learnenglish.today/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="grid size-9 place-items-center rounded-full border border-white/15 transition hover:border-white/40 hover:text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a><a href="https://www.facebook.com/people/Online-Spoken-English-Classes/100070549382270/?ref=PROFILE_EDIT_xav_ig_profile_page_web#" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="grid size-9 place-items-center rounded-full border border-white/15 transition hover:border-white/40 hover:text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94z" /></svg></a></div></div><div className="order-1 lg:max-w-sm"><h3 className="font-semibold">A word a day</h3><p className="mt-3 text-sm leading-6 text-brand-dark-body">A little vocabulary boost, refreshed every day.</p><div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-lg font-semibold text-brand-accent-light">{todayWord.word}</p><p className="mt-1.5 text-sm leading-6 text-brand-dark-body">{todayWord.meaning}</p><p className="mt-2 text-sm italic leading-6 text-brand-dark-caption">“{todayWord.example}”</p></div></div></div><div className="relative z-10 border-t border-white/10 px-5 py-5 text-center text-xs text-brand-dark-caption">© 2025 English Learning Course. Made for curious minds.</div></footer>
    </div>
  )
}

export default LearningLanding
