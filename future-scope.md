# Future Scope

Features/sections removed from the live site but kept here for future implementation.

## Book a Session: automatic WhatsApp send (not yet implemented)

Current implementation (`components/learning-landing.tsx`, booking dialog): fully client-side.
On submit, the form builds a `wa.me` / `api.whatsapp.com` link prefilled with the student's
details and opens it — the student must tap **Send** once inside WhatsApp themselves. There is
no backend, no database, and no WhatsApp API credentials anywhere in the project. This is a
hard platform limitation of `wa.me` links, not a bug: nothing can auto-send a WhatsApp message
without a real API call.

**Upgrade path, if/when automatic sending (no tap required, both to admin and back to the
student) is wanted:**

1. Add a Server Action (`app/actions/book-session.ts`, `'use server'`) that receives the
   validated form data instead of building a client-side `wa.me` link.
2. Sign up for the WhatsApp Business Platform (Cloud API) — directly via Meta, or via a
   third-party provider (Interakt / AiSensy / WATI / Twilio) for easier onboarding.
3. Store the provider's access token as a server-only env var (never `NEXT_PUBLIC_`); call it
   only from the Server Action.
4. Submit the admin-notification and student-confirmation message text as **Message
   Templates** for Meta review/approval — free-form text can only be sent within a 24-hour
   window *after* the recipient has messaged the business first, which doesn't apply here
   since the student is submitting a web form, not messaging first. Template approval can take
   hours to a couple of days on first submission.
5. Once approved, the Server Action sends both messages server-side on submit; no tap required
   on either end.
6. Optional but recommended alongside this: persist the request in a database first (see the
   original scope-analysis conversation for the full `session_requests` schema/rationale), so a
   failed WhatsApp send doesn't silently lose the lead.

## Course Levels section (removed 2026-09-23)

Was rendered as `<section id="courses">` in `components/learning-landing.tsx`, right after
the hero section. Replaced on the live site by a "Services Offered" section.

Reintroduce by:
1. Adding the `levels` array back near the top of `components/learning-landing.tsx`.
2. Adding the JSX section back into the page (e.g. after the hero, or wherever it fits next).
3. Restoring the "Courses" nav link (header + footer) pointing at `#courses`.

### Data

```tsx
const levels = [
  { level: 'A1', title: 'Beginner', desc: 'Build your everyday foundations.', color: 'bg-[#eaf2ff]', accent: 'text-[#4777c8]', points: ['Basic introductions', 'Everyday vocabulary', 'Simple questions'] },
  { level: 'A2', title: 'Elementary', desc: 'Speak with more ease and clarity.', color: 'bg-[#eef8f2]', accent: 'text-[#3e9b72]', points: ['Daily conversations', 'Past & future tense', 'Travel essentials'] },
  { level: 'B1', title: 'Intermediate', desc: 'Express ideas with confidence.', color: 'bg-[#fff3e8]', accent: 'text-[#d58a42]', points: ['Fluent storytelling', 'Opinion & discussion', 'Workplace English'] },
  { level: 'B2/C1', title: 'Advanced', desc: 'Polish your English for impact.', color: 'bg-[#f2edff]', accent: 'text-[#8a6ac3]', points: ['Nuanced expression', 'Business communication', 'Natural fluency'] },
]
```

### JSX

```tsx
<section id="courses" className="border-y border-[#edf1f5] bg-white py-20">
  <div className="mx-auto max-w-7xl px-5 lg:px-8">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#2f6fb0]">Find your level</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#17375e] sm:text-4xl">A course for every conversation.</h2>
      </div>
      <a href="#placement" className="flex items-center gap-2 text-sm font-semibold text-[#2c5c96]">Not sure where to start? <ArrowRight className="size-4" /></a>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {levels.map((item) => (
        <article key={item.level} className={`${item.color} group rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-lg`}>
          <div className="flex items-start justify-between">
            <span className={`${item.accent} text-3xl font-semibold tracking-tight`}>{item.level}</span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#66788d]">12 weeks</span>
          </div>
          <h3 className="mt-8 text-xl font-semibold text-[#24445c]">{item.title}</h3>
          <p className="mt-2 text-sm text-[#65798b]">{item.desc}</p>
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-[#526a7b]">
            {item.points.map((point) => (
              <li key={point} className="flex items-center gap-2"><Check className="size-4 text-[#2f6fb0]" />{point}</li>
            ))}
          </ul>
          <Button variant="outline" className="mt-6 w-full rounded-xl border-white/80 bg-white/65 text-[#31506e] hover:bg-white">
            Explore level <ArrowRight data-icon="inline-end" />
          </Button>
        </article>
      ))}
    </div>
  </div>
</section>
```

## Placement test / practice quiz section (removed 2026-09-23)

Was rendered as `<section id="placement">` in `components/learning-landing.tsx`, between the
Services section and the Teachers section. A single sample question ("If I ___ more time, I
would learn another language.") with clickable answer options and inline correct/incorrect
feedback.

Reintroduce by:
1. Adding back the `selectedAnswer` state: `const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)`.
2. Adding the JSX section back into the page.
3. Restoring the `Clock3` icon import from `lucide-react` (used for the "Takes less than 3 minutes" badge).
4. If re-adding the Courses section too, restore the "Not sure where to start? → #placement" link that pointed here.

### JSX

```tsx
<section id="placement" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
  <div className="flex flex-col justify-center">
    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#2f6fb0]">Try it now</p>
    <h2 className="max-w-md text-3xl font-semibold tracking-tight text-[#17375e] sm:text-4xl">A little practice goes a long way.</h2>
    <p className="mt-5 max-w-md leading-7 text-[#6c7b91]">Get a feel for our teaching style with a quick sample from the placement test. No pressure, just progress.</p>
    <div className="mt-7 flex items-center gap-3 text-sm text-[#6c7b91]">
      <span className="grid size-9 place-items-center rounded-full bg-[#e6eefb] text-[#2f6fb0]"><Clock3 className="size-4" /></span> Takes less than 3 minutes
    </div>
  </div>
  <div className="rounded-3xl border border-[#e4ebf1] bg-white p-6 shadow-[0_18px_50px_rgba(50,90,110,0.08)] sm:p-8">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8190a0]">Question 1 of 8</span>
      <span className="text-sm font-medium text-[#2f6fb0]">12% complete</span>
    </div>
    <div className="mt-3 h-1.5 rounded-full bg-[#eaf0f4]"><div className="h-full w-[12%] rounded-full bg-[#2f6fb0]" /></div>
    <h3 className="mt-8 text-xl font-semibold leading-8 text-[#24445c]">If I <span className="rounded bg-[#e6eefb] px-1 text-[#2f6fb0]">_____</span> more time, I would learn another language.</h3>
    <div className="mt-6 grid gap-3">
      {['have', 'had', 'would have', 'will have'].map((answer) => (
        <button
          key={answer}
          onClick={() => setSelectedAnswer(answer)}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
            selectedAnswer === answer
              ? answer === 'had'
                ? 'border-[#55a582] bg-[#eef8f2] text-[#267856]'
                : 'border-[#e4a35c] bg-[#fff8ed] text-[#9b6a32]'
              : 'border-[#e4ebf1] text-[#526a7b] hover:border-[#a9c7e6]'
          }`}
        >
          <span className="grid size-5 place-items-center rounded-full border border-current text-xs">
            {selectedAnswer === answer && <span className="size-2 rounded-full bg-current" />}
          </span>
          {answer}
        </button>
      ))}
    </div>
    {selectedAnswer && (
      <div className={`mt-5 flex items-start gap-3 rounded-xl p-4 text-sm ${selectedAnswer === 'had' ? 'bg-[#eef8f2] text-[#277452]' : 'bg-[#fff8ed] text-[#9b6a32]'}`}>
        <ShieldCheck className="mt-0.5 size-4" />
        <span>
          <strong>{selectedAnswer === 'had' ? 'That&apos;s right!' : 'Almost there!'}</strong>{' '}
          {selectedAnswer === 'had' ? '“Had” is used for an unreal or hypothetical condition.' : 'The correct answer is “had” — give it another try.'}
        </span>
      </div>
    )}
  </div>
</section>
```

## Resources section (removed 2026-09-23)

Was rendered as `<section id="resources">` in `components/learning-landing.tsx`, between the
Teachers section and the Stories section. A tabbed "Your English toolkit" grid (Worksheets /
Audio Guides / Grammar Cheatsheets) with downloadable resource cards.

Reintroduce by:
1. Adding the `resources` array back near the top of `components/learning-landing.tsx`.
2. Adding back the `resourceTab` state: `const [resourceTab, setResourceTab] = useState('Worksheets')`.
3. Adding the JSX section back into the page.
4. Restoring the `Download` icon import from `lucide-react` (used on each resource card's download button), and the `BookOpen` icon import if nothing else references it (used for the Worksheets resource icon).
5. Restoring the "Resources" nav link (header desktop nav, mobile menu, footer "Explore" list) pointing at `#resources`.

### Data

```tsx
const resources = [
  { type: 'Worksheets', icon: BookOpen, title: 'The conversation starter pack', meta: '12 pages · PDF', color: 'bg-[#eaf2ff]' },
  { type: 'Audio Guides', icon: Headphones, title: '7-minute pronunciation warm-up', meta: '7 min · Audio', color: 'bg-[#eef8f2]' },
  { type: 'Grammar Cheatsheets', icon: Sparkles, title: 'Tenses made simple', meta: '2 pages · PDF', color: 'bg-[#fff3e8]' },
]
```

### JSX

```tsx
<section id="resources" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
  <div className="flex flex-wrap items-end justify-between gap-5">
    <div>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#2f6fb0]">Keep exploring</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#17375e] sm:text-4xl">Your English toolkit.</h2>
    </div>
    <div className="flex gap-1 rounded-xl bg-[#f1f5f8] p-1">
      {['Worksheets', 'Audio Guides', 'Grammar Cheatsheets'].map((tab) => (
        <button
          key={tab}
          onClick={() => setResourceTab(tab)}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${resourceTab === tab ? 'bg-white text-[#1a3a5c] shadow-sm' : 'text-[#8794a5]'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
  <div className="mt-10 grid gap-4 md:grid-cols-3">
    {resources
      .filter((item) => item.type === resourceTab)
      .concat(resources.filter((item) => item.type !== resourceTab))
      .slice(0, 3)
      .map((item) => (
        <article key={item.title} className="group rounded-2xl border border-[#e7edf2] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <div className={`grid aspect-[1.65] place-items-center rounded-xl ${item.color}`}>
            <item.icon className="size-10 text-[#4777c8]" />
          </div>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#9aa7b5]">{item.type}</p>
              <h3 className="mt-1 font-semibold text-[#24445c]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#8794a5]">{item.meta}</p>
            </div>
            <button aria-label={`Download ${item.title}`} className="rounded-lg border border-[#e4ebf1] p-2 text-[#2f6fb0] transition hover:bg-[#e6eefb]">
              <Download className="size-4" />
            </button>
          </div>
        </article>
      ))}
  </div>
</section>
```
