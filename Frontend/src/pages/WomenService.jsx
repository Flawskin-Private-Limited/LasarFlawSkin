import React, { useEffect, useRef, useState } from 'react'
import { ChevronUp, Clock3, MoreHorizontal, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useCart } from '../context/CartContext'
import { onServicesChange, onBundlesChange, onCombosChange } from '../firebase/serviceService'

// Import images (used as fallback when Firestore image URLs aren't available)
import underarmImg from '../assets/images/underarm.png'
import legsImg from '../assets/images/legs.png'
import backImg from '../assets/images/back.png'
import bikiniImg from '../assets/images/Bikini.png'
import chestAbdomenImg from '../assets/images/chest & abdomen.png'
import buttocksImg from '../assets/images/Buttocks.png'
import fullFaceImg from '../assets/images/full face.png'
import upperLipImg from '../assets/images/upper lip.png'
import chinImg from '../assets/images/chin.png'
import sideLockImg from '../assets/images/side lock.png'
import cheekImg from '../assets/images/cheek.png'
import upperNeckImg from '../assets/images/Upper neck.png'
import handsImg from '../assets/images/Hands.png'
import faceIcon from '../assets/images/face.png'
import fullBodyIcon from '../assets/images/fullbody.png'
import upperBodyIcon from '../assets/images/upper body.png'
import lowerBodyIcon from '../assets/images/lower body.png'
import allServicesIcon from '../assets/images/all services.png'
import comboIcon from '../assets/images/combo.png'

// Local image fallback map — maps asset path strings from Firestore to local imports
const IMAGE_MAP = {
  '/src/assets/images/underarm.png': underarmImg,
  '/src/assets/images/legs.png': legsImg,
  '/src/assets/images/back.png': backImg,
  '/src/assets/images/Bikini.png': bikiniImg,
  '/src/assets/images/chest & abdomen.png': chestAbdomenImg,
  '/src/assets/images/Buttocks.png': buttocksImg,
  '/src/assets/images/full face.png': fullFaceImg,
  '/src/assets/images/upper lip.png': upperLipImg,
  '/src/assets/images/chin.png': chinImg,
  '/src/assets/images/side lock.png': sideLockImg,
  '/src/assets/images/cheek.png': cheekImg,
  '/src/assets/images/Upper neck.png': upperNeckImg,
  '/src/assets/images/Hands.png': handsImg,
}

function resolveImage(imagePath) {
  if (!imagePath) return null
  // If it's already a data URL, blob, or http(s) URL, use directly
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:') || imagePath.startsWith('http')) return imagePath
  return IMAGE_MAP[imagePath] || imagePath
}

// Format number to ₹ string
function formatPrice(value) {
  if (typeof value === 'string') return value
  return `₹${value.toLocaleString('en-IN')}`
}

const WomenService = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCareModal, setShowCareModal] = useState(false)
  const [categoryScrollProgress, setCategoryScrollProgress] = useState(0)
  const [categoryThumbSize, setCategoryThumbSize] = useState(30)
  const [isDraggingScroll, setIsDraggingScroll] = useState(false)
  const [expandedMobileDescriptions, setExpandedMobileDescriptions] = useState({})
  const [firestoreServices, setFirestoreServices] = useState([])
  const [firestoreBundles, setFirestoreBundles] = useState([])
  const [firestoreCombos, setFirestoreCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const categoryScrollRef = useRef(null)
  const categoryTrackRef = useRef(null)
  const dragStartXRef = useRef(0)
  const dragStartProgressRef = useRef(0)
  
  const { addToCart, getCartCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Real-time Firestore listeners
  useEffect(() => {
    setLoading(true)
    let servicesLoaded = false, bundlesLoaded = false, combosLoaded = false
    const checkDone = () => {
      if (servicesLoaded && bundlesLoaded && combosLoaded) setLoading(false)
    }

    const handleError = (label) => (error) => {
      console.error(`${label} Firestore error:`, error)
      // If the error message contains an index link, show it to the user
      if (error?.message?.includes('index')) {
        toast.error(`Firestore needs a composite index for ${label}. Check browser console (F12) for the creation link.`)
      } else {
        toast.error(`Failed to load ${label}: ${error.message}`)
      }
    }

    const unsubServices = onServicesChange('women', (data) => {
      setFirestoreServices(data)
      servicesLoaded = true
      checkDone()
    }, (err) => { handleError('services')(err); servicesLoaded = true; checkDone() })

    const unsubBundles = onBundlesChange('women', (data) => {
      setFirestoreBundles(data)
      bundlesLoaded = true
      checkDone()
    }, (err) => { handleError('bundles')(err); bundlesLoaded = true; checkDone() })

    const unsubCombos = onCombosChange('women', (data) => {
      setFirestoreCombos(data)
      combosLoaded = true
      checkDone()
    }, (err) => { handleError('combos')(err); combosLoaded = true; checkDone() })

    // Safety timeout — if Firestore doesn't respond within 10s, stop loading
    const timeout = setTimeout(() => {
      if (!servicesLoaded || !bundlesLoaded || !combosLoaded) {
        console.warn('Firestore listeners timed out after 10s')
        toast.error('Services are taking too long to load. Check your connection and Firestore setup.')
        setLoading(false)
      }
    }, 10000)

    return () => {
      clearTimeout(timeout)
      unsubServices()
      unsubBundles()
      unsubCombos()
    }
  }, [])

  // Transform Firestore data → component format
  const otherServices = [
    // Regular services (with resolved images and formatted prices)
    ...firestoreServices.map((s) => ({
      ...s,
      image: resolveImage(s.image),
      mrp: formatPrice(s.mrp),
      price: formatPrice(s.price),
    })),
  ]

  // Insert full body bundles at correct positions (after first service)
  const fullBodyCards = firestoreBundles.map((b) => ({
    ...b,
    isFullBodyCard: true,
    plans: b.plans.map((p) => ({
      ...p,
      mrp: formatPrice(p.mrp),
      price: formatPrice(p.price),
    })),
  }))

  // Build the combined otherServices array with bundles inserted
  const allServiceItems = (() => {
    if (otherServices.length === 0) return [...fullBodyCards]
    const result = [otherServices[0], ...fullBodyCards, ...otherServices.slice(1)]
    return result
  })()

  const comboPackages = firestoreCombos.map((c) => ({
    ...c,
    mrp: formatPrice(c.mrp),
    price: formatPrice(c.price),
  }))

  const updateCategoryProgress = () => {
    const scroller = categoryScrollRef.current
    if (!scroller) return

    const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 1)
    const progress = scroller.scrollLeft / maxScroll
    const thumbPercent = Math.max((scroller.clientWidth / scroller.scrollWidth) * 100, 18)

    setCategoryScrollProgress(Math.min(Math.max(progress, 0), 1))
    setCategoryThumbSize(Math.min(thumbPercent, 100))
  }

  const scrollCategories = (delta) => {
    const scroller = categoryScrollRef.current
    if (!scroller) return
    scroller.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const handleAddToCart = (service, planData = null) => {
    const rawPrice = planData ? planData.price : service.price;
    const rawMrp = planData ? planData.mrp : service.mrp;

    const parsePrice = (p) => {
      if (typeof p === 'number') return p;
      if (typeof p === 'string') return parseFloat(p.replace(/[₹,]/g, '')) || 0;
      return 0;
    };

    const cartItem = {
      id: planData ? planData.id : service.id,
      name: service.title,
      description: planData 
        ? `${service.title} - ${planData.sessions} Session${planData.sessions > 1 ? 's' : ''}` 
        : service.shortTitle || service.title,
      price: parsePrice(rawPrice),
      originalPrice: parsePrice(rawMrp),
      duration: planData ? planData.duration : service.duration,
      image: service.image || null,
      includes: planData ? planData.includes : [service.area],
      sessions: planData ? planData.sessions : 1,
      category: 'Women Laser Treatment'
    }
    
    addToCart(cartItem)
    toast.success(`${cartItem.name} added to cart!`)
  }

  const handleBuyNow = (service, planData = null) => {
    handleAddToCart(service, planData)
    navigate('/cart')
  }

  const handleAddFaceNeckBundle = () => {
    // Create a bundled item for all face & neck services
    const bundlePrice = faceNeckBundleItems.reduce((sum, item) => 
      sum + parseFloat(item.price.replace(/[₹,]/g, '')), 0
    )
    const bundleMrp = faceNeckBundleItems.reduce((sum, item) => 
      sum + parseFloat(item.mrp.replace(/[₹,]/g, '')), 0
    )
    
    const bundleItem = {
      id: 'face-neck-bundle',
      name: 'Face & Neck Complete Bundle',
      description: `All Face & Neck Services (${faceNeckBundleItems.length} services)`,
      price: bundlePrice,
      originalPrice: bundleMrp,
      duration: 'Varies',
      image: fullFaceImg,
      includes: faceNeckBundleItems.map(item => item.name),
      sessions: 1,
      category: 'Women Laser Treatment'
    }
    
    addToCart(bundleItem)
    toast.success('Face & Neck Bundle added to cart!')
  }

  const handleToggleMobileDescription = (key) => {
    setExpandedMobileDescriptions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getClampStyle = (lines) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  })

  const handleCategoryTrackClick = (event) => {
    const scroller = categoryScrollRef.current
    const track = categoryTrackRef.current
    if (!scroller || !track) return

    const rect = track.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const targetProgress = Math.min(Math.max(clickX / rect.width, 0), 1)
    const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0)
    scroller.scrollTo({ left: targetProgress * maxScroll, behavior: 'smooth' })
  }

  const handleThumbMouseDown = (event) => {
    event.preventDefault()
    dragStartXRef.current = event.clientX
    dragStartProgressRef.current = categoryScrollProgress
    setIsDraggingScroll(true)
  }

  const handleMobileCategorySelect = (category, event) => {
    setActiveCategory(category)
    event.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  useEffect(() => {
    updateCategoryProgress()
    const onResize = () => updateCategoryProgress()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!isDraggingScroll) return

    const handleMouseMove = (event) => {
      const scroller = categoryScrollRef.current
      const track = categoryTrackRef.current
      if (!scroller || !track) return

      const trackWidth = track.getBoundingClientRect().width
      if (!trackWidth) return

      const deltaX = event.clientX - dragStartXRef.current
      const usablePercent = (100 - categoryThumbSize) / 100
      const deltaProgress = (deltaX / trackWidth) * (usablePercent > 0 ? 1 / usablePercent : 1)
      const nextProgress = Math.min(Math.max(dragStartProgressRef.current + deltaProgress, 0), 1)
      const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0)

      scroller.scrollLeft = nextProgress * maxScroll
      setCategoryScrollProgress(nextProgress)
    }

    const handleMouseUp = () => setIsDraggingScroll(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingScroll, categoryThumbSize])

  // Filter services for different categories
  const faceNeckServices = otherServices.filter(s => s.area === 'Face' || s.area === 'Neck')
  const upperBodyServices = otherServices.filter(s => ['Arms', 'Hands', 'Underarms', 'Chest & Abdomen', 'Chest & Abdomin', 'Back'].includes(s.area))
  const lowerBodyServices = otherServices.filter(s => ['Legs', 'Bikini', 'Buttocks'].includes(s.area))
  const allServicesWithoutFace = otherServices.filter(s => s.area !== 'Face' && s.area !== 'Neck').slice(0, 10)
  const allServicesOrdered = allServicesWithoutFace.length
    ? [allServicesWithoutFace[0], ...fullBodyCards, ...allServicesWithoutFace.slice(1)]
    : [...fullBodyCards]
  const faceNeckBundleItems = otherServices
    .filter((service) => !service.isFullBodyCard && (service.area === 'Face' || service.area === 'Neck') && service.id !== 'full-face')
    .map((service) => ({
      id: service.id,
      name: service.shortTitle,
      mrp: service.mrp,
      price: service.price,
      duration: service.duration
    }))
  const twoLineClamp = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  }

  // Desktop card component
  const DesktopCard = ({ service }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div
        className="relative h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${service.image})` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">{service.shortTitle}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-5" style={twoLineClamp}>{service.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Starting at</span>
            <div className="flex items-baseline gap-2">
              <span className="line-through text-slate-400">{service.mrp}</span>
              <span className="text-2xl font-semibold text-[#8dcae4]">{service.price}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {service.duration}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">⭐ {service.rating} ({service.reviews} Reviews)</span>
          <button
            type="button"
            onClick={() => setShowCareModal(true)}
            className="text-[#8dcae4] hover:text-[#8dcae4] hover:underline text-sm font-medium"
          >
            Pre & Post Care
          </button>
        </div>
        <div className="mt-2 mb-2 flex items-center gap-2">
          <button onClick={() => handleAddToCart(service)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-medium py-2"><ShoppingCart className="h-4 w-4" />Add to Cart</button>
          <button onClick={() => handleBuyNow(service)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-medium py-2">Buy Now</button>
        </div>
      </div>
    </div>
  )

  // Mobile card - content left, image right
  const MobileCard = ({ service }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex flex-col h-full">
      <div className="flex gap-2 flex-1">
        <div className="flex-1 p-1">
          <div>
            <h3 className="text-[25px] font-bold text-slate-900 leading-tight">{service.shortTitle}</h3>
            <p
              className="text-lg text-slate-700 mt-1 leading-6"
              style={getClampStyle(expandedMobileDescriptions[`service-${service.id}`] ? 2 : 1)}
            >
              Get smooth, hair-free {service.shortTitle.toLowerCase()} with safe laser hair removal
            </p>
            {expandedMobileDescriptions[`service-${service.id}`] && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCareModal(true)}
                  className="mt-1 block text-[#8dcae4] text-sm font-medium hover:underline"
                >
                  Pre & Post Care
                </button>
                <span className="mt-1 flex w-fit items-center gap-1 text-sm text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {service.duration}
                </span>
              </>
            )}
            {expandedMobileDescriptions[`service-${service.id}`] ? (
              <button
                type="button"
                onClick={() => handleToggleMobileDescription(`service-${service.id}`)}
                className="mt-1 flex w-fit items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-black text-sm"
                aria-label="Show less"
              >
                <ChevronUp className="h-4 w-4" />
                <span>Less</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleToggleMobileDescription(`service-${service.id}`)}
                className="mt-1 flex w-fit items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-black text-sm"
                aria-label="Show more"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span>More</span>
              </button>
            )}
          </div>
          <div className="flex items-center mt-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="line-through text-slate-400 text-lg">{service.mrp}</span>
                <span className="text-2xl font-semibold text-[#8dcae4]">{service.price}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-24 h-24 rounded-xl bg-cover bg-center self-start mt-2 flex-shrink-0" style={{ backgroundImage: `url(${service.image})` }} />
      </div>
      <div className="flex items-center gap-2 mt-2 mb-2 px-1">
        <button onClick={() => handleAddToCart(service)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-base font-medium py-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
        <button onClick={() => handleBuyNow(service)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-base font-medium py-2">
          Buy Now
        </button>
      </div>
    </div>
  )

  // Desktop full body grouped card
  const DesktopFullBodyCard = ({ card }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-3 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
            {card.badge && (
              <span className="inline-flex items-center rounded-lg bg-[#8dcae4]/70 text-[10px] font-semibold text-slate-700 px-3 py-2 uppercase leading-tight">
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-5" style={twoLineClamp}>{card.subtitle}</p>
        </div>

        <div className="space-y-1.5">
          {card.plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-slate-800">{plan.sessions} Session{plan.sessions > 1 ? 's' : ''}</p>
                  <span className="text-[11px] text-slate-400">/</span>
                  <p className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock3 className="h-3 w-3" />
                    {plan.duration}
                  </p>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm text-slate-400 line-through">{plan.mrp}</span>
                  <p className="text-2xl font-semibold text-[#8dcae4] leading-none">{plan.price}</p>
                </div>
              </div>
              <button onClick={() => handleAddToCart(card, plan)} className="inline-flex items-center justify-center gap-1 rounded-md bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-black text-xs font-semibold px-4 py-2">
                <ShoppingCart className="h-3 w-3" />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const DesktopFaceNeckBundleCard = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="px-3 pt-3">
        <h3 className="text-xl font-bold text-slate-900">Face &amp; Neck</h3>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {faceNeckBundleItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-slate-800">{item.name}</p>
                <span className="text-slate-400">/</span>
                <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock3 className="h-3 w-3" />
                  {item.duration}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-slate-400 line-through">{item.mrp}</span>
              <span className="text-xl leading-none font-semibold text-[#8dcae4]">{item.price}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#8dcae4] text-[#8dcae4] text-sm font-semibold leading-none">+</span>
            </div>
          </div>
        ))}
        <button onClick={handleAddFaceNeckBundle} className="mt-auto pt-2 mb-1 w-full rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-semibold py-2">
          Add Full Face To Cart
        </button>
      </div>
    </div>
  )

  // Mobile full body grouped card
  const MobileFullBodyCard = ({ card }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-3 flex flex-col gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{card.title}</h3>
            {card.badge && (
              <span className="inline-flex items-center rounded-lg bg-[#8dcae4]/70 text-[9px] font-semibold text-slate-700 px-2 py-1 uppercase">
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 leading-5" style={twoLineClamp}>{card.subtitle}</p>
          <button
            type="button"
            onClick={() => setShowCareModal(true)}
            className="mt-1 block text-[#8dcae4] text-sm font-medium hover:underline"
          >
            Pre & Post Care
          </button>
        </div>
        <div className="space-y-2">
          {card.plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-800">{plan.sessions} Session{plan.sessions > 1 ? 's' : ''}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs text-slate-400 line-through">{plan.mrp}</span>
                  <p className="text-xl font-semibold text-[#8dcae4] leading-none">{plan.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {plan.duration}
                </p>
                <button onClick={() => handleAddToCart(card, plan)} className="inline-flex items-center justify-center rounded-md bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-black p-2" aria-label="Add to cart">
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const MobileFaceNeckBundleCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-3 pt-3">

        <h3 className="text-[25px] font-medium text-slate-900">Face &amp; Neck</h3>
        <button
          type="button"
          onClick={() => setShowCareModal(true)}
          className="mt-1 block text-[#8dcae4] text-sm font-medium hover:underline"
        >
          Pre & Post Care
        </button>

      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        {faceNeckBundleItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg text-slate-800">{item.name}</p>
                <span className="text-slate-400">/</span>
                <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.duration}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="text-xs text-slate-400 line-through">{item.mrp}</span>
              <span className="text-lg leading-none font-semibold text-[#8dcae4]">{item.price}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#8dcae4] text-[#8dcae4] text-sm font-semibold leading-none">+</span>
            </div>
          </div>
        ))}
        <button onClick={handleAddFaceNeckBundle} className="mt-auto pt-2 mb-1 w-full rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-semibold py-2">
          Add Full Face To Cart
        </button>
      </div>
    </div>
  )

  // Desktop combo card
  const DesktopComboCard = ({ combo }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-3 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight" style={twoLineClamp}>
            {combo.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-5" style={twoLineClamp}>
            Get smooth, hair-free skin with our safe and effective laser hair removal treatments.
          </p>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="line-through text-slate-400">
                {combo.mrp}
              </span>
              <span className="text-xl font-semibold text-[#8dcae4]">
                {combo.price}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {combo.duration}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">⭐ {combo.rating} ({combo.reviews} Reviews)</span>
          <button
            type="button"
            onClick={() => setShowCareModal(true)}
            className="text-[#8dcae4] hover:text-[#8dcae4] hover:underline text-xs font-medium"
          >
            Pre & Post Care
          </button>
        </div>
        <div className="mt-auto pt-2 mb-2 flex items-center gap-2">
          <button onClick={() => handleAddToCart(combo)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-medium py-2">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          <button onClick={() => handleBuyNow(combo)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-medium py-2">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )

  // Mobile combo card
  const MobileComboCard = ({ combo }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-3 flex flex-col gap-2 flex-1">
          <div>
            <h3 className="text-[30px] font-bold text-slate-900 leading-tight" style={twoLineClamp}>
              {combo.title}
            </h3>
            <p
              className="text-lg text-slate-700 mt-1 leading-6"
              style={getClampStyle(expandedMobileDescriptions[`combo-${combo.id}`] ? 2 : 1)}
            >
              Get smooth, hair-free {combo.title.toLowerCase()} with safe laser hair removal
            </p>
            {expandedMobileDescriptions[`combo-${combo.id}`] && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCareModal(true)}
                  className="mt-1 block text-[#8dcae4] text-sm font-medium hover:underline"
                >
                  Pre & Post Care
                </button>
                <span className="mt-1 flex w-fit items-center gap-1 text-sm text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {combo.duration}
                </span>
              </>
            )}
            {expandedMobileDescriptions[`combo-${combo.id}`] ? (
              <button
                type="button"
                onClick={() => handleToggleMobileDescription(`combo-${combo.id}`)}
                className="mt-1 flex w-fit items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-black text-sm"
                aria-label="Show less"
              >
                <ChevronUp className="h-4 w-4" />
                <span>Less</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleToggleMobileDescription(`combo-${combo.id}`)}
                className="mt-1 flex w-fit items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-black text-sm"
                aria-label="Show more"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span>More</span>
              </button>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex items-baseline gap-1">
              <span className="line-through text-slate-400 text-lg">
                {combo.mrp}
              </span>
              <span className="text-2xl font-semibold text-[#8dcae4]">
                {combo.price}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-auto pt-2 mb-2">
            <button onClick={() => handleAddToCart(combo)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-base font-medium py-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            <button onClick={() => handleBuyNow(combo)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-base font-medium py-2">
              Buy Now
            </button>
          </div>
        </div>
    </div>
  )

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 pt-16">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#8dcae4] border-r-transparent"></div>
            <p className="mt-4 text-slate-500">Loading services...</p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      {!loading && (
      <main className="w-full">
        <div className="w-full px-4 lg:px-6 py-4 lg:py-8">
          {/* Page Heading */}
          <div className="mb-4 lg:mb-6">
            <h1 className="text-3xl md:text-[32px] font-semibold text-slate-900 tracking-tight mb-1">
              Women&apos;s Laser Treatment
            </h1>
            <p className="text-lg md:text-[15px] text-slate-500 max-w-xl block">
              Premium medical-grade hair reduction packages tailored for women.
            </p>
          </div>

          {/* Mobile Horizontal Categories */}
          <div ref={categoryScrollRef} onScroll={updateCategoryProgress} className="mb-4 overflow-x-auto pb-2 md:hidden">
            <div className="flex gap-2 min-w-max">
              <button 
                onClick={(event) => handleMobileCategorySelect('all', event)} 
                className={`px-2 py-2 rounded-full text-lg font-medium whitespace-nowrap hover:-translate-y-0.5 transition-all duration-200 ${
                  activeCategory === 'all' ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <img src={allServicesIcon} alt="All Services" className="h-6 w-6 object-contain" />
                  All Services
                </span>
              </button>
              <button 
                onClick={(event) => handleMobileCategorySelect('face', event)} 
                className={`px-2 py-2 rounded-full text-lg font-medium whitespace-nowrap hover:-translate-y-0.5 transition-all duration-200 ${
                  activeCategory === 'face' ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <img src={faceIcon} alt="Face & Neck" className="h-6 w-6 object-contain" />
                  Face & Neck
                </span>
              </button>
              <button 
                onClick={(event) => handleMobileCategorySelect('fullbody', event)} 
                className={`px-2 py-2 rounded-full text-lg font-medium whitespace-nowrap hover:-translate-y-0.5 transition-all duration-200 ${
                  activeCategory === 'fullbody' ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <img src={fullBodyIcon} alt="Full Body" className="h-6 w-6 object-contain" />
                  Full Body
                </span>
              </button>
              <button 
                onClick={(event) => handleMobileCategorySelect('upper', event)} 
                className={`px-2 py-2 rounded-full text-lg font-medium whitespace-nowrap hover:-translate-y-0.5 transition-all duration-200 ${
                  activeCategory === 'upper' ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <img src={upperBodyIcon} alt="Upper Body" className="h-6 w-6 object-contain" />
                  Upper Body
                </span>
              </button>
              <button 
                onClick={(event) => handleMobileCategorySelect('lower', event)} 
                className={`px-2 py-2 rounded-full text-lg font-medium whitespace-nowrap hover:-translate-y-0.5 transition-all duration-200 ${
                  activeCategory === 'lower' ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <img src={lowerBodyIcon} alt="Lower Body" className="h-6 w-6 object-contain" />
                  Lower Body
                </span>
              </button>
              <button 
                onClick={(event) => handleMobileCategorySelect('combo', event)} 
                className={`px-2 py-2 rounded-full text-lg font-medium whitespace-nowrap hover:-translate-y-0.5 transition-all duration-200 ${
                  activeCategory === 'combo' ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <img src={comboIcon} alt="Combo" className="h-6 w-6 object-contain" />
                  Combo
                </span>
              </button>
            </div>
          </div>
          <div className="md:hidden -mt-0.5 mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCategories(-140)}
                className="h-0 w-0 border-y-[7px] border-y-transparent border-r-[10px] border-r-slate-500"
                aria-label="Scroll categories left"
              />
              <div
                ref={categoryTrackRef}
                onClick={handleCategoryTrackClick}
                className="relative h-2.5 flex-1 rounded-full bg-slate-300 overflow-hidden cursor-pointer"
              >
                <div
                  onMouseDown={handleThumbMouseDown}
                  className="absolute top-0 h-2.5 rounded-full bg-slate-500 cursor-grab"
                  style={{
                    width: `${categoryThumbSize}%`,
                    left: `${categoryScrollProgress * (100 - categoryThumbSize)}%`
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => scrollCategories(140)}
                className="h-0 w-0 border-y-[7px] border-y-transparent border-l-[10px] border-l-slate-500"
                aria-label="Scroll categories right"
              />
            </div>
          </div>

          <div className="flex gap-4 lg:gap-6">
            {/* Left Sidebar (always visible on desktop) */}
            <aside className="hidden md:block w-80 flex-shrink-0 h-full">
              {/* Categories & Shopping Cart Combined */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-5 h-full flex flex-col overflow-y-auto">
                <h3 className="text-base font-semibold tracking-[0.24em] text-slate-400 mb-4 uppercase">
                  Categories
                </h3>
                <div className="space-y-2 text-base mb-6">
                  <button onClick={() => setActiveCategory('all')} className={`w-full flex items-center justify-between rounded-xl px-2 py-2 text-left hover:-translate-y-0.5 transition-all duration-200 ${
                    activeCategory === 'all'
                      ? 'bg-[#8dcae4] text-slate-900 hover:bg-[#79b8d3]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <span className="inline-flex items-center gap-2">
                      <img src={allServicesIcon} alt="All Services" className="h-8 w-8 object-contain" />
                      All Services
                    </span>
                    <span className={`text-[11px] px-2 py-[2px] rounded-full ${
                      activeCategory === 'all'
                        ? 'bg-[#8dcae4]/70'
                        : 'bg-slate-200'
                    }`}>
                      {allServicesWithoutFace.length + fullBodyCards.length}
                    </span>
                  </button>
                  <button onClick={() => setActiveCategory('face')} className={`w-full flex items-center justify-between rounded-xl px-2 py-2 text-left hover:-translate-y-0.5 transition-all duration-200 ${
                    activeCategory === 'face'
                      ? 'bg-[#8dcae4] text-slate-900 shadow-sm hover:bg-[#79b8d3]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <span className="inline-flex items-center gap-2">
                      <img src={faceIcon} alt="Face & Neck" className="h-8 w-8 object-contain" />
                      Face &amp; Neck
                    </span>
                    <span className={`text-[11px] px-2 py-[2px] rounded-full ${
                      activeCategory === 'face'
                        ? 'bg-[#8dcae4]/70'
                        : 'bg-slate-200'
                    }`}>
                      {faceNeckServices.length}
                    </span>
                  </button>
                  <button onClick={() => setActiveCategory('fullbody')} className={`w-full flex items-center justify-between rounded-xl px-2 py-2 text-left hover:-translate-y-0.5 transition-all duration-200 ${
                    activeCategory === 'fullbody'
                      ? 'bg-[#8dcae4] text-slate-900 shadow-sm hover:bg-[#79b8d3]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <span className="inline-flex items-center gap-2">
                      <img src={fullBodyIcon} alt="Full Body" className="h-8 w-8 object-contain" />
                      Full Body
                    </span>
                    <span className={`text-[11px] px-2 py-[2px] rounded-full ${
                      activeCategory === 'fullbody'
                        ? 'bg-[#8dcae4]/70'
                        : 'bg-slate-200'
                    }`}>
                      {fullBodyCards.length}
                    </span>
                  </button>
                  <button onClick={() => setActiveCategory('upper')} className={`w-full flex items-center justify-between rounded-xl px-2 py-2 text-left hover:-translate-y-0.5 transition-all duration-200 ${
                    activeCategory === 'upper'
                      ? 'bg-[#8dcae4] text-slate-900 shadow-sm hover:bg-[#79b8d3]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <span className="inline-flex items-center gap-2">
                      <img src={upperBodyIcon} alt="Upper Body" className="h-8 w-8 object-contain" />
                      Upper Body
                    </span>
                    <span className={`text-[11px] px-2 py-[2px] rounded-full ${
                      activeCategory === 'upper'
                        ? 'bg-[#8dcae4]/70'
                        : 'bg-slate-200'
                    }`}>
                      {otherServices.filter(s => ['Arms', 'Hands', 'Underarms', 'Chest & Abdomen', 'Back'].includes(s.area)).length}
                    </span>
                  </button>
                  <button onClick={() => setActiveCategory('lower')} className={`w-full flex items-center justify-between rounded-xl px-2 py-2 text-left hover:-translate-y-0.5 transition-all duration-200 ${
                    activeCategory === 'lower'
                      ? 'bg-[#8dcae4] text-slate-900 shadow-sm hover:bg-[#79b8d3]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <span className="inline-flex items-center gap-2">
                      <img src={lowerBodyIcon} alt="Lower Body" className="h-8 w-8 object-contain" />
                      Lower Body
                    </span>
                    <span className={`text-[11px] px-2 py-[2px] rounded-full ${
                      activeCategory === 'lower'
                        ? 'bg-[#8dcae4]/70'
                        : 'bg-slate-200'
                    }`}>
                      {otherServices.filter(s => ['Legs', 'Bikini', 'Buttocks'].includes(s.area)).length}
                    </span>
                  </button>
                  <button onClick={() => setActiveCategory('combo')} className={`w-full flex items-center justify-between rounded-xl px-2 py-2 text-left hover:-translate-y-0.5 transition-all duration-200 ${
                    activeCategory === 'combo'
                      ? 'bg-[#8dcae4] text-slate-900 shadow-sm hover:bg-[#79b8d3]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <span className="inline-flex items-center gap-2">
                      <img src={comboIcon} alt="Combo Packages" className="h-8 w-8 object-contain" />
                      Combo Packages
                    </span>
                    <span className={`text-[11px] px-2 py-[2px] rounded-full ${
                      activeCategory === 'combo'
                        ? 'bg-[#8dcae4]/70'
                        : 'bg-slate-200'
                    }`}>
                      {comboPackages.length}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-semibold tracking-[0.24em] text-slate-400 mb-4 uppercase">
                    Shopping Cart
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    You have <span className="font-semibold text-slate-700">{getCartCount()} item{getCartCount() !== 1 ? 's' : ''}</span> in your cart.
                  </p>
                  <button onClick={() => navigate('/cart')} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#8dcae4] hover:bg-[#79b8d3] hover:-translate-y-0.5 transition-all duration-200 text-slate-900 text-sm font-medium py-3 shadow-sm">
                    <ShoppingCart className="h-4 w-4" />
                    <span>View Checkout</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Cards Section */}
            <section className="flex-1">
              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                {/* Face & Neck Category */}
                {activeCategory === 'face' && (
                  <div className="space-y-3">
                    {faceNeckServices.map((service) => (
                      <MobileCard key={service.id} service={service} />
                    ))}
                  </div>
                )}

                {/* Upper Body Category */}
                {activeCategory === 'upper' && (
                  <div className="space-y-3">
                    {upperBodyServices.map((service) => (
                      <MobileCard key={service.id} service={service} />
                    ))}
                  </div>
                )}

                {/* Lower Body Category */}
                {activeCategory === 'lower' && (
                  <div className="space-y-3">
                    {lowerBodyServices.map((service) => (
                      <MobileCard key={service.id} service={service} />
                    ))}
                  </div>
                )}

                {/* Full Body Category */}
                {activeCategory === 'fullbody' && (
                  <div className="space-y-3">
                    {fullBodyCards.map((card) => (
                      <MobileFullBodyCard key={card.id} card={card} />
                    ))}
                  </div>
                )}

                {/* All Services Category */}
                {activeCategory === 'all' && (
                  <div className="space-y-3">
                    {allServicesOrdered.flatMap((item, index) => (
                      index === 3 ? [
                        <MobileFaceNeckBundleCard key="mobile-face-neck-bundle" />,
                        item.isFullBodyCard
                          ? <MobileFullBodyCard key={item.id} card={item} />
                          : <MobileCard key={item.id} service={item} />
                      ] : [
                        item.isFullBodyCard
                          ? <MobileFullBodyCard key={item.id} card={item} />
                          : <MobileCard key={item.id} service={item} />
                      ]
                    ))}
                  </div>
                )}

                {/* Combo Packages Category */}
                {activeCategory === 'combo' && (
                  <div className="space-y-3">
                    {comboPackages.map((combo) => (
                      <MobileComboCard key={combo.id} combo={combo} />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                {/* Face & Neck Category */}
                {activeCategory === 'face' && (
                  <>
                    {faceNeckServices.map((service) => (
                      <DesktopCard key={service.id} service={service} />
                    ))}
                  </>
                )}

                {/* Upper Body Category */}
                {activeCategory === 'upper' && (
                  <>
                    {upperBodyServices.map((service) => (
                      <DesktopCard key={service.id} service={service} />
                    ))}
                  </>
                )}

                {/* Lower Body Category */}
                {activeCategory === 'lower' && (
                  <>
                    {lowerBodyServices.map((service) => (
                      <DesktopCard key={service.id} service={service} />
                    ))}
                  </>
                )}

                {/* Full Body Category */}
                {activeCategory === 'fullbody' && (
                  <>
                    {fullBodyCards.map((card) => (
                      <DesktopFullBodyCard key={card.id} card={card} />
                    ))}
                  </>
                )}

                {/* All Services Category */}
                {activeCategory === 'all' && (
                  <>
                    {allServicesOrdered.flatMap((item, index) => (
                      index === 3 ? [
                        <DesktopFaceNeckBundleCard key="desktop-face-neck-bundle" />,
                        item.isFullBodyCard
                          ? <DesktopFullBodyCard key={item.id} card={item} />
                          : <DesktopCard key={item.id} service={item} />
                      ] : [
                        item.isFullBodyCard
                          ? <DesktopFullBodyCard key={item.id} card={item} />
                          : <DesktopCard key={item.id} service={item} />
                      ]
                    ))}
                  </>
                )}

                {/* Combo Packages Category */}
                {activeCategory === 'combo' && (
                  <>
                    {comboPackages.map((combo) => (
                      <DesktopComboCard key={combo.id} combo={combo} />
                    ))}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      )}

      {showCareModal && (
        <div className="flex fixed inset-0 z-50 items-center justify-center bg-slate-900/35 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-slate-800 inline-flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#8dcae4]/60 text-[10px] text-[#8dcae4]">i</span>
                Pre & Post Care
              </h2>
              <button
                type="button"
                onClick={() => setShowCareModal(false)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="px-4 py-4 space-y-5 text-slate-600">
              <div>
                <h3 className="text-[13px] font-semibold text-slate-800 mb-2 pl-2 border-l-2 border-[#8dcae4]">Pre-laser care</h3>
                <ul className="space-y-2.5 text-[13px] leading-5">
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Avoid waxing or threading for 15 days before service.</li>
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Avoid micro-needling, peels, and bleaching for 7 days before service.</li>
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Avoid medicated creams like retinol and steroids for 7 days before service.</li>
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Avoid laser treatment if you have open wounds, cuts, bruises, or skin infections.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[13px] font-semibold text-slate-800 mb-2 pl-2 border-l-2 border-[#8dcae4]">Post-laser care</h3>
                <ul className="space-y-2.5 text-[13px] leading-5">
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Apply high-SPF sunscreen (at least SPF 50) and keep your skin moisturized.</li>
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Use gentle skin products and refrain from plucking, waxing, or threading.</li>
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8dcae4] flex-shrink-0" />Avoid hot baths, saunas, and super-sweaty activities for at least 2 days after each session.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  )
}

export default WomenService;
