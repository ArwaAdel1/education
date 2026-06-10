import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Clock,
  Video,
  FileText,
  Brain,
  Bot,
  Star,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useDirection } from '@/hooks/useDirection';
import { cn } from '@/lib/utils/cn';
import { mockAnalytics } from '@/mocks/analytics';
import { mockChapters, mockLessons } from '@/mocks/content';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const heroGradient = 'bg-gradient-to-l from-primary via-secondary to-primary';

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Render numbers with Arabic-Indic digits when the UI is RTL (Arabic). */
function toLocaleDigits(value: number | string, isRtl: boolean): string {
  const str = String(value);
  if (!isRtl) return str;
  return str.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Lesson count + total minutes for a chapter, derived from mock lessons. */
function getChapterStats(chapterId: string): { lessons: number; minutes: number } {
  const lessons = mockLessons.filter((lesson) => lesson.chapterId === chapterId);
  if (lessons.length === 0) {
    // Mock data only ships detailed lessons for the first chapter; show a
    // representative figure for the rest so the cards stay meaningful.
    return { lessons: 3, minutes: 90 };
  }
  return {
    lessons: lessons.length,
    minutes: lessons.reduce((total, lesson) => total + lesson.duration, 0),
  };
}

function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="font-cairo text-2xl font-bold text-text-primary">{title}</h2>
      {subtitle && <p className="font-cairo text-base text-text-secondary">{subtitle}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="flex scroll-smooth flex-col bg-background">
      <LandingNavbar />
      <HeroSection isDesktop={isDesktop} />
      <ChaptersSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection isDesktop={isDesktop} />
      <FAQSection />
      <CTASection isDesktop={isDesktop} />
      <LandingFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const navLinks = [
  { key: 'home', id: 'hero' },
  { key: 'content', id: 'chapters' },
  { key: 'testimonials', id: 'testimonials' },
] as const;

function LandingNavbar() {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');

  const handleNav = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Right (RTL): hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t('nav.home')}
            aria-expanded={menuOpen}
            className="rounded-button p-2 text-primary transition-colors hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            type="button"
            onClick={() => handleNav('hero')}
            className="font-cairo text-lg font-bold text-primary md:text-xl"
          >
            {t('brand')}
          </button>
        </div>

        {/* Center (desktop): nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => handleNav(link.id)}
              className={cn(
                'font-cairo text-sm font-medium transition-colors',
                active === link.id
                  ? 'border-b-2 border-accent pb-1 text-primary'
                  : 'text-text-secondary hover:text-accent',
              )}
            >
              {t(`nav.${link.key}`)}
            </button>
          ))}
        </div>

        {/* Left (RTL): language + login + register */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="hidden font-cairo text-sm font-medium text-text-secondary transition-colors hover:text-accent md:inline"
          >
            {t('nav.login')}
          </button>
          <Button
            size="sm"
            className="hidden rounded-full md:inline-flex"
            onClick={() => navigate('/auth')}
          >
            {t('nav.register')}
          </Button>
          <Button size="sm" className="rounded-full md:hidden" onClick={() => navigate('/auth')}>
            {t('nav.registerMobile')}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => handleNav(link.id)}
                className="rounded-button px-2 py-2 text-right font-cairo text-sm font-medium text-text-secondary transition-colors hover:bg-gray-100"
              >
                {t(`nav.${link.key}`)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate('/auth');
              }}
              className="rounded-button px-2 py-2 text-right font-cairo text-sm font-medium text-text-secondary hover:bg-gray-100"
            >
              {t('nav.login')}
            </button>
            <div className="pt-1">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroSection({ isDesktop }: { isDesktop: boolean }) {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();
  const isRtl = useDirection() === 'rtl';
  const goRegister = () => navigate('/auth');

  const stats = [
    { value: mockAnalytics.totalStudents, label: t('hero.stats.students') },
    { value: mockAnalytics.publishedChapters, label: t('hero.stats.chapters') },
    { value: mockAnalytics.quizzesCreated, label: t('hero.stats.quizzes') },
  ];

  return (
    <section id="hero" className={cn(heroGradient, 'scroll-mt-16 px-4 py-12 md:py-20')}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
        {/* Content — right column in RTL */}
        <div className="flex flex-col items-center text-center md:items-start md:text-right">
          <span className="font-cairo text-sm font-medium text-accent">{t('hero.breadcrumb')}</span>
          <h1 className="mt-3 font-cairo text-2xl font-extrabold leading-tight text-white md:text-[40px]">
            {t('hero.academyName')}
          </h1>
          <p className="mt-2 font-cairo text-lg text-white/80">{t('hero.teacherName')}</p>

          {isDesktop && (
            <p className="mt-4 max-w-lg font-cairo text-base leading-relaxed text-white/60">
              {t('hero.bio')}
            </p>
          )}

          {isDesktop ? (
            <>
              <div className="mt-8 flex gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-cairo text-2xl font-bold text-white">
                      {toLocaleDigits(stat.value, isRtl)}
                    </span>
                    <span className="font-cairo text-sm text-white/50">{stat.label}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8 rounded-full" onClick={goRegister}>
                <GraduationCap size={20} />
                {t('hero.cta')}
              </Button>
            </>
          ) : (
            <div className="mt-6 flex w-full flex-col gap-3">
              <Button size="lg" className="w-full rounded-full" onClick={goRegister}>
                {t('hero.ctaSubscribe')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full border-white bg-transparent text-white hover:bg-white/10"
                onClick={goRegister}
              >
                {t('hero.ctaTrial')}
              </Button>
            </div>
          )}
        </div>

        {/* Teacher photo — left column in RTL */}
        <div className="flex flex-col items-center">
          <img
            src="/images/hero.png"
            alt={t('hero.photoAlt')}
            className="aspect-[4/5] w-full max-w-[300px] rounded-card object-cover shadow-2xl md:max-w-[400px]"
          />

          {!isDesktop && (
            <div className="mt-6 flex w-full gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-1 flex-col items-center rounded-lg bg-white/10 p-3 text-center"
                >
                  <span className="font-cairo text-xl font-bold text-white">
                    {toLocaleDigits(stat.value, isRtl)}
                  </span>
                  <span className="font-cairo text-xs text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chapters                                                            */
/* ------------------------------------------------------------------ */

function ChaptersSection() {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();
  const isRtl = useDirection() === 'rtl';

  return (
    <section id="chapters" className="scroll-mt-16 bg-background px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t('chapters.title')} subtitle={t('chapters.subtitle')} />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {mockChapters.map((chapter) => {
            const stats = getChapterStats(chapter.id);
            const locked = !chapter.isUnlocked;

            return (
              <Card
                key={chapter.id}
                padding="none"
                className={cn('overflow-hidden', locked && 'opacity-80')}
              >
                {/* Cover placeholder */}
                <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/20">
                  <BookOpen size={48} className="text-white/40" />
                  {locked && (
                    <Badge variant="warning" className="absolute left-3 top-3 bg-warning text-white">
                      {t('chapters.comingSoon')}
                    </Badge>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-cairo text-lg font-bold text-text-primary">{chapter.name}</h3>
                  <div className="mt-1 flex items-center gap-3 font-cairo text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {toLocaleDigits(stats.lessons, isRtl)} {t('chapters.lessons')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {toLocaleDigits(stats.minutes, isRtl)} {t('chapters.minutes')}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-cairo text-lg font-bold text-primary">
                      {toLocaleDigits(chapter.price, isRtl)} {t('chapters.priceUnit')}
                    </span>
                    {locked ? (
                      <Button size="sm" disabled className="rounded-full bg-gray-300 text-white">
                        {t('chapters.comingSoon')}
                      </Button>
                    ) : (
                      <Button size="sm" className="rounded-full" onClick={() => navigate('/auth')}>
                        {t('chapters.subscribe')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const featureItems = [
  { key: 'video', icon: Video },
  { key: 'pdf', icon: FileText },
  { key: 'quizzes', icon: Brain },
  { key: 'tutor', icon: Bot },
] as const;

function FeaturesSection() {
  const { t } = useTranslation('landing');

  return (
    <section className="bg-surface px-4 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t('features.title')} />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {featureItems.map(({ key, icon: Icon }) => (
            <Card key={key} padding="lg" className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Icon size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-cairo text-base font-bold text-text-primary">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-1 font-cairo text-sm leading-relaxed text-text-secondary">
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const stepKeys = ['step1', 'step2', 'step3'] as const;

function HowItWorksSection() {
  const { t } = useTranslation('landing');
  const isRtl = useDirection() === 'rtl';

  return (
    <section className="bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={t('howItWorks.title')} />

        <div className="mt-10 flex flex-col items-stretch md:flex-row md:items-start">
          {stepKeys.map((step, idx) => (
            <Fragment key={step}>
              <div className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-cairo text-xl font-bold text-white">
                  {toLocaleDigits(idx + 1, isRtl)}
                </div>
                <h3 className="mt-3 font-cairo text-base font-bold text-text-primary">
                  {t(`howItWorks.${step}.title`)}
                </h3>
                <p className="mt-1 max-w-[220px] font-cairo text-sm text-text-secondary">
                  {t(`howItWorks.${step}.desc`)}
                </p>
              </div>

              {idx < stepKeys.length - 1 && (
                <div className="mx-auto my-2 h-12 w-[2px] bg-accent/30 md:my-0 md:mt-6 md:h-[2px] md:w-auto md:flex-1" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

function TestimonialsSection({ isDesktop }: { isDesktop: boolean }) {
  const { t } = useTranslation('landing');
  const items = t('testimonials.items', { returnObjects: true }) as Testimonial[];

  return (
    <section id="testimonials" className="scroll-mt-16 bg-surface px-4 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t('testimonials.title')} />

        <div
          className={cn(
            'mt-10',
            isDesktop ? 'grid grid-cols-3 gap-6' : 'flex snap-x gap-4 overflow-x-auto pb-2',
          )}
        >
          {items.map((item) => (
            <Card
              key={item.name}
              padding="none"
              className={cn('bg-primary/5 p-6', !isDesktop && 'min-w-[280px] shrink-0 snap-start')}
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-warning text-warning" />
                ))}
              </div>
              <p className="mt-3 min-h-[80px] font-cairo text-sm leading-relaxed text-text-primary">
                {item.quote}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 font-cairo font-bold text-accent">
                  {item.name.charAt(0)}
                </div>
                <span className="font-cairo text-sm font-bold text-text-primary">{item.name}</span>
                <span className="text-text-secondary">•</span>
                <span className="font-cairo text-xs text-text-secondary">{item.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

interface FaqItem {
  q: string;
  a: string;
}

function FAQSection() {
  const { t } = useTranslation('landing');
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-16 bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[800px]">
        <SectionHeading title={t('faq.title')} />

        <div className="mt-10">
          {items.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <Card key={idx} padding="none" className="mb-3">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right"
                >
                  <span className="font-cairo text-base font-bold text-text-primary">{item.q}</span>
                  {open ? (
                    <ChevronUp size={20} className="shrink-0 text-accent" />
                  ) : (
                    <ChevronDown size={20} className="shrink-0 text-text-secondary" />
                  )}
                </button>
                {open && (
                  <div className="border-t border-border px-5 pb-5 pt-3">
                    <p className="font-cairo text-sm leading-relaxed text-text-secondary">{item.a}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function CTASection({ isDesktop }: { isDesktop: boolean }) {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();

  return (
    <section className={cn(heroGradient, 'px-4 py-16')}>
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="font-cairo text-2xl font-bold text-white md:text-3xl">{t('cta.title')}</h2>
        <p className="mt-3 font-cairo text-base text-white/60">{t('cta.subtitle')}</p>
        <Button
          size="lg"
          className={cn('mt-6 rounded-full', !isDesktop && 'w-full')}
          onClick={() => navigate('/auth')}
        >
          {t('cta.btn')}
        </Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function LandingFooter() {
  const { t } = useTranslation('landing');
  const curriculumLinks = t('footer.curriculumLinks', { returnObjects: true }) as string[];

  return (
    <footer className="bg-primary px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 text-center md:flex-row md:justify-between md:text-right">
          {/* Brand */}
          <div className="md:max-w-xs">
            <span className="font-cairo text-xl font-bold text-accent">{t('brand')}</span>
            <p className="mt-2 font-cairo text-sm text-white/60">{t('footer.academyName')}</p>
            <p className="mt-1 font-cairo text-xs text-white/40">{t('footer.platformDesc')}</p>
          </div>

          {/* Curriculum */}
          <div>
            <h4 className="mb-3 font-cairo text-sm font-bold text-white/80">{t('footer.curriculum')}</h4>
            <ul className="flex flex-col gap-2">
              {curriculumLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#chapters"
                    className="font-cairo text-sm text-white/50 transition-colors hover:text-accent"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important links */}
          <div>
            <h4 className="mb-3 font-cairo text-sm font-bold text-white/80">
              {t('footer.importantLinks')}
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#faq"
                  className="font-cairo text-sm text-white/50 transition-colors hover:text-accent"
                >
                  {t('footer.faqLink')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-cairo text-sm text-white/50 transition-colors hover:text-accent"
                >
                  {t('footer.contactUs')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-cairo text-sm font-bold text-white/80">{t('footer.contactUs')}</h4>
            <div className="flex justify-center gap-4 md:justify-start">
              <a
                href="#"
                aria-label={t('footer.whatsapp')}
                className="text-white/50 transition-colors hover:text-accent"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                aria-label={t('footer.email')}
                className="text-white/50 transition-colors hover:text-accent"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="font-cairo text-xs text-white/40">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
