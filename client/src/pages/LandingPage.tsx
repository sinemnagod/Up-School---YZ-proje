import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

// Floating petal component
function Petal({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none" style={style}>
      <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 0 C30 15 35 30 20 60 C5 30 10 15 20 0Z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}

// Floating circle blob
function Blob({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={style}
    />
  )
}

const FEATURES = [
  {
    icon: '🔍',
    title: 'Ingredient Intelligence',
    desc: 'See exactly what\'s in every product. Get instant alerts on ingredients your skin reacts to.',
  },
  {
    icon: '⚗️',
    title: 'Conflict Detection',
    desc: 'Build your AM/PM routine with confidence. We flag incompatible ingredient combinations before they cause damage.',
  },
  {
    icon: '✨',
    title: 'Personalised for You',
    desc: 'Set your skin type and trigger ingredients. Every product is scored for your unique skin profile.',
  },
  {
    icon: '🤖',
    title: 'AI Skin Consultant',
    desc: 'Chat with our AI assistant for personalised skincare advice, ingredient explanations, and product guidance.',
  },
  {
    icon: '📅',
    title: 'Streak Tracker',
    desc: 'Build consistency with daily check-ins and earn badges at key milestones.',
  },
  {
    icon: '🌿',
    title: 'K-Beauty Focus',
    desc: 'Curated catalog of Korean and international skincare brands with detailed ingredient data.',
  },
]

interface Product {
  id: string
  name: string
  brand: string
  category: string
  skin_type_tags: string[]
  image_url: string | null
}

const categoryColors: Record<string, string> = {
  CLEANSER:    'bg-gl-softbloom text-gl-plum',
  TONER:       'bg-gl-softbloom text-gl-plum',
  SERUM:       'bg-gl-nightbloom text-gl-petalmist',
  MOISTURIZER: 'bg-gl-moss text-white',
  SPF:         'bg-gl-pollen text-gl-nightbloom',
  OIL:         'bg-gl-lavender text-gl-nightbloom',
  EXFOLIANT:   'bg-gl-danger-light text-gl-danger',
  EYE_CREAM:   'bg-gl-softbloom text-gl-plum',
  MASK:        'bg-gl-blush text-gl-plum',
}

export default function LandingPage() {
  const { user } = useAuthStore()
  const [scrollY, setScrollY] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setFeaturedProducts((data as Product[]).slice(0, 4)))
      .catch(() => setFeaturedProducts([]))
      .finally(() => setProductsLoading(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const petals = [
    { top: '8%',  left: '5%',  width: 24, color: '#CC8898', animDuration: '6s',  animDelay: '0s'   },
    { top: '15%', left: '88%', width: 18, color: '#A85068', animDuration: '8s',  animDelay: '1s'   },
    { top: '35%', left: '3%',  width: 30, color: '#E0AABA', animDuration: '7s',  animDelay: '2s'   },
    { top: '55%', left: '92%', width: 20, color: '#CC8898', animDuration: '9s',  animDelay: '0.5s' },
    { top: '70%', left: '8%',  width: 16, color: '#A85068', animDuration: '6s',  animDelay: '3s'   },
    { top: '80%', left: '85%', width: 28, color: '#E0AABA', animDuration: '8s',  animDelay: '1.5s' },
    { top: '25%', left: '50%', width: 14, color: '#CC8898', animDuration: '10s', animDelay: '2.5s' },
    { top: '60%', left: '45%', width: 22, color: '#A85068', animDuration: '7s',  animDelay: '4s'   },
  ]

  return (
    <div className="min-h-screen bg-gl-parchment overflow-x-hidden">

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(5deg); }
          66% { transform: translateY(-6px) rotate(-3deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-20px) rotate(8deg) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float var(--dur, 6s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .animate-float-slow { animation: floatSlow var(--dur, 8s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: scrollY > 50 ? 'rgba(122, 53, 72, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(12px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Link to="/" className="font-display text-2xl text-gl-petalmist">GlowLogic</Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-gl-petalmist/80 text-sm hover:text-gl-petalmist transition-colors flex items-center gap-1">
            <span>🔍</span> Products
          </Link>
          {user ? (
            <Link
              to="/challenges"
              className="bg-gl-moss text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
            >
              🏠 My Activity
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gl-petalmist/80 text-sm hover:text-gl-petalmist transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-gl-moss text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3C1828 0%, #7A3548 40%, #A85068 70%, #ECC8D0 100%)' }}
      >
        {/* Animated blobs */}
        <Blob style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, #A85068 0%, transparent 70%)',
          top: '-10%', left: '-10%',
          animation: 'pulse-soft 6s ease-in-out infinite',
        }} />
        <Blob style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, #CC8898 0%, transparent 70%)',
          bottom: '-5%', right: '-5%',
          animation: 'pulse-soft 8s ease-in-out infinite',
          animationDelay: '2s',
        }} />
        <Blob style={{
          width: 300, height: 300,
          background: 'radial-gradient(circle, #E0AABA 0%, transparent 70%)',
          top: '30%', right: '15%',
          animation: 'pulse-soft 7s ease-in-out infinite',
          animationDelay: '1s',
        }} />

        {/* Floating petals */}
        {petals.map((p, i) => (
          <Petal
            key={i}
            style={{
              top: p.top,
              left: p.left,
              width: p.width,
              color: p.color,
              ['--dur' as any]: p.animDuration,
              ['--delay' as any]: p.animDelay,
              animation: `float ${p.animDuration} ease-in-out infinite`,
              animationDelay: p.animDelay,
            }}
          />
        ))}

        {/* Spinning botanical ring */}
        <div className="absolute opacity-10 animate-spin-slow" style={{ width: 600, height: 600 }}>
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                <path
                  d="M100 20 C110 40 115 60 100 80 C85 60 90 40 100 20Z"
                  fill="#ECC8D0"
                />
              </g>
            ))}
            <circle cx="100" cy="100" r="15" fill="#ECC8D0" />
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 500),
          }}
        >
          <p className="text-gl-blush text-xs font-medium tracking-widest uppercase mb-6 animate-fade-in">
            Your Skincare Intelligence Platform
          </p>

          <h1 className="font-display font-light text-gl-petalmist mb-6 leading-none animate-fade-up"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
          >
            Find solutions to all<br />
            <em>of your skin concerns</em>
          </h1>

          <p className="text-gl-blush text-lg mb-10 max-w-xl mx-auto leading-relaxed animate-fade-up delay-2">
            Decode ingredient lists, detect routine conflicts, and get personalised skincare advice — all in one place.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up delay-3">
            {user ? (
              <Link
                to="/challenges"
                className="bg-gl-moss text-white font-medium px-8 py-3.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all text-sm"
              >
                Go to My Activity
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gl-moss text-white font-medium px-8 py-3.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all text-sm"
                >
                  Start for Free
                </Link>
                <Link
                  to="/products"
                  className="bg-white/10 backdrop-blur text-gl-petalmist font-medium px-8 py-3.5 rounded-md hover:bg-white/20 transition-all text-sm border border-white/20"
                >
                  Browse Products
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
          style={{ animationDelay: '1s', opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <span className="text-gl-blush/60 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gl-blush/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ECC8D0 0%, transparent 70%)' }}
        />

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-3">
              Everything you need
            </p>
            <h2 className="font-display text-5xl text-gl-ink">
              Smart skincare,<br /><em>simplified</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6 hover:border-gl-wildrose hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-display text-xl text-gl-ink mb-2 group-hover:text-gl-plum transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-gl-stone leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, #F0E4D0 0%, #ECC8D0 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-3">
            Simple process
          </p>
          <h2 className="font-display text-5xl text-gl-ink mb-16">
            How it works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your profile', desc: 'Set your skin type and add ingredients your skin reacts to.' },
              { step: '02', title: 'Browse & check products', desc: 'Search our catalog. Every product is instantly checked against your profile.' },
              { step: '03', title: 'Build your routine', desc: 'Add products to your AM/PM routine. We detect conflicts and warn you before they cause damage.' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center">
                <span className="font-display text-6xl font-light text-gl-dustypetal mb-4">{s.step}</span>
                <h3 className="font-display text-xl text-gl-ink mb-2">{s.title}</h3>
                <p className="text-sm text-gl-stone leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-6 bg-gl-parchment">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-3">
                Curated catalog
              </p>
              <h2 className="font-display text-5xl text-gl-ink">
                Explore <em>products</em>
              </h2>
            </div>
            <Link
              to="/products"
              className="bg-gl-plum text-gl-petalmist text-sm font-medium px-6 py-3 rounded-md hover:opacity-90 transition-all"
            >
              See more products →
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden animate-pulse">
                  <div className="h-36 bg-gl-pebble/40" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 bg-gl-pebble/40 rounded" />
                    <div className="h-5 w-3/4 bg-gl-pebble/40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-sm text-gl-stone text-center py-12">
              Products coming soon — check back shortly.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden hover:border-gl-wildrose hover:shadow-md transition-all group"
                >
                  <div className="h-36 bg-gradient-to-br from-gl-blush to-gl-softbloom flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="font-display text-4xl text-gl-dustypetal">{product.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium tracking-wider uppercase text-gl-stone mb-1">{product.brand}</p>
                    <h3 className="font-display text-lg text-gl-ink leading-snug mb-2">{product.name}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[product.category] ?? 'bg-gl-petalmist text-gl-stone'}`}>
                      {product.category.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/products"
                className="text-gl-wildrose text-sm font-medium hover:underline"
              >
                See more products →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="py-24 px-6 relative overflow-hidden"
        style={{ background: '#3C1828' }}
      >
        {/* Decorative petals */}
        <div className="absolute top-8 left-8 opacity-10 animate-float-slow"
          style={{ ['--dur' as any]: '8s', width: 80 }}
        >
          <svg viewBox="0 0 40 60" fill="#ECC8D0"><path d="M20 0 C30 15 35 30 20 60 C5 30 10 15 20 0Z" /></svg>
        </div>
        <div className="absolute bottom-8 right-8 opacity-10 animate-float-slow"
          style={{ ['--dur' as any]: '6s', ['--delay' as any]: '2s', width: 60 }}
        >
          <svg viewBox="0 0 40 60" fill="#CC8898"><path d="M20 0 C30 15 35 30 20 60 C5 30 10 15 20 0Z" /></svg>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <span className="text-4xl mb-6 block">🤖</span>
          <p className="text-xs font-medium tracking-widest uppercase text-gl-blush mb-3">
            AI Powered
          </p>
          <h2 className="font-display text-5xl text-gl-petalmist mb-6">
            Your personal<br /><em>skin consultant</em>
          </h2>
          <p className="text-gl-blush text-lg leading-relaxed mb-10">
            Not sure if a product is right for you? Ask our AI. It knows your skin type, your triggers, and your routine — and gives you honest, personalised answers.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left max-w-md mx-auto mb-10">
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <div className="bg-gl-softbloom text-gl-ink text-sm px-4 py-2.5 rounded-xl rounded-br-sm max-w-xs">
                  I have sensitive skin and want to try retinol. Is it safe?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/10 text-gl-petalmist text-sm px-4 py-2.5 rounded-xl rounded-bl-sm max-w-xs">
                  For sensitive skin, I'd recommend starting with a low concentration (0.025%) and using it only 1-2 nights per week. Always follow with a fragrance-free moisturiser...
                </div>
              </div>
            </div>
          </div>
          {!user && (
            <Link
              to="/register"
              className="bg-gl-moss text-white font-medium px-8 py-3.5 rounded-md hover:opacity-90 transition-all text-sm inline-block"
            >
              Try it free
            </Link>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <Blob style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, #ECC8D0 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse-soft 6s ease-in-out infinite',
        }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-display text-5xl text-gl-ink mb-6">
            Ready to understand<br /><em>your skin?</em>
          </h2>
          <p className="text-gl-stone text-lg mb-10">
            Join GlowLogic and take the guesswork out of skincare.
          </p>
          {user ? (
            <Link
              to="/products"
              className="bg-gl-plum text-gl-petalmist font-medium px-10 py-4 rounded-md hover:opacity-90 transition-all text-sm inline-block"
            >
              Browse Products
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-gl-plum text-gl-petalmist font-medium px-10 py-4 rounded-md hover:opacity-90 transition-all text-sm"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="text-gl-stone text-sm hover:text-gl-plum transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gl-nightbloom px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-2xl text-gl-petalmist block mb-1">GlowLogic</span>
            <span className="text-gl-stone text-xs">Find solutions to all of your skin concerns</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/products" className="text-gl-dustypetal text-sm hover:text-gl-petalmist transition-colors">Products</Link>
            <Link to="/register" className="text-gl-dustypetal text-sm hover:text-gl-petalmist transition-colors">Register</Link>
            <Link to="/login" className="text-gl-dustypetal text-sm hover:text-gl-petalmist transition-colors">Sign in</Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-gl-plum">
          <p className="text-gl-stone text-xs text-center">© 2026 GlowLogic. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}