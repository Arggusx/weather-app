import { useState, useRef, useEffect, useCallback } from 'react'

const hourlyData = [
    { time: '12 AM', icon: '🌧️', chance: '30%', temp: '19°' },
    { time: 'Now', icon: '🌙', chance: '', temp: '19°', active: true },
    { time: '2 AM', icon: '🌨️', chance: '', temp: '18°' },
    { time: '3 AM', icon: '☁️', chance: '', temp: '19°' },
    { time: '4 AM', icon: '🌧️', chance: '', temp: '19°' },
]

const weeklyData = [
    { time: 'Mon', icon: '☀️', chance: '', temp: '22°' },
    { time: 'Tue', icon: '🌧️', chance: '60%', temp: '17°' },
    { time: 'Wed', icon: '⛅', chance: '', temp: '20°' },
    { time: 'Thu', icon: '🌧️', chance: '40%', temp: '16°' },
    { time: 'Fri', icon: '☀️', chance: '', temp: '23°' },
]

const LetsGo = () => {
    const collapseAmount = 295
    const [sheetOffset, setSheetOffset] = useState(collapseAmount)
    const [isDragging, setIsDragging] = useState(false)
    const [activeTab, setActiveTab] = useState('hourly')
    const [selectedCard, setSelectedCard] = useState(null)
    const [plusRotated, setPlusRotated] = useState(false)
    const dragging = useRef(false)
    const startY = useRef(0)
    const startOffset = useRef(0)
    const currentOffset = useRef(collapseAmount)

    const forecastData = activeTab === 'hourly' ? hourlyData : weeklyData

    const handleMove = useCallback((clientY) => {
        if (!dragging.current) return
        const delta = clientY - startY.current
        const newOffset = Math.min(collapseAmount, Math.max(0, startOffset.current + delta))
        currentOffset.current = newOffset
        setSheetOffset(newOffset)
    }, [])

    const handleEnd = useCallback(() => {
        if (!dragging.current) return
        dragging.current = false
        setIsDragging(false)
        const snapTo = currentOffset.current > collapseAmount / 2 ? collapseAmount : 0
        setSheetOffset(snapTo)
        currentOffset.current = snapTo
    }, [])

    useEffect(() => {
        const onMouseMove = (e) => handleMove(e.clientY)
        const onMouseUp = () => handleEnd()
        const onTouchMove = (e) => handleMove(e.touches[0].clientY)
        const onTouchEnd = () => handleEnd()

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        window.addEventListener('touchend', onTouchEnd)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('touchmove', onTouchMove)
            window.removeEventListener('touchend', onTouchEnd)
        }
    }, [handleMove, handleEnd])

    const handleStart = (clientY) => {
        dragging.current = true
        setIsDragging(true)
        startY.current = clientY
        startOffset.current = currentOffset.current
    }

    const handleCardClick = (i) => {
        setSelectedCard(selectedCard === i ? null : i)
    }

    // expandProgress: 1 = sheet em cima (expandido), 0 = sheet recolhido (embaixo)
    const expandProgress = 1 - sheetOffset / collapseAmount
    // Quando sheet sobe: casa sobe, texto some
    const houseUp = expandProgress * 40
    const weatherOpacity = Math.max(0, (sheetOffset / collapseAmount))
    const weatherScale = 0.85 + (sheetOffset / collapseAmount) * 0.15
    const weatherBlur = (1 - sheetOffset / collapseAmount) * 8
    const houseScale = 1 - expandProgress * 0.05

    return (
        <>
            <div className="container">
                <img className="mobile" src="/Images/Image.png" alt="" />
                <img
                    className="house"
                    style={{
                        transform: `translateY(-${houseUp}px) scale(${houseScale})`,
                    }}
                    src="/Images/House.png"
                    alt=""
                />
                <div
                    className="weather"
                    style={{
                        opacity: weatherOpacity,
                        transform: `scale(${weatherScale}) translateY(${(1 - weatherOpacity) * -20}px)`,
                        filter: `blur(${weatherBlur}px)`,
                        pointerEvents: weatherOpacity < 0.3 ? 'none' : 'auto',
                    }}
                >
                    <div className="local">Montreal</div>
                    <div className="temp">19°</div>
                    <div className="info">
                        <div className="clima">Mostly Clear</div>
                        <div className="umidade"><span>H:24°</span><span>L:12°</span></div>
                    </div>
                </div>

                <div
                    className={`bottom-sheet ${isDragging ? '' : 'smooth'}`}
                    style={{ transform: `translateX(-50%) translateY(${sheetOffset}px)` }}
                    onTouchStart={(e) => handleStart(e.touches[0].clientY)}
                    onMouseDown={(e) => handleStart(e.clientY)}
                >
                    <div className="sheet-handle"></div>

                    <div className="sheet-tabs">
                        <span
                            className={`sheet-tab ${activeTab === 'hourly' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hourly')}
                        >
                            Hourly Forecast
                        </span>
                        <span
                            className={`sheet-tab ${activeTab === 'weekly' ? 'active' : ''}`}
                            onClick={() => setActiveTab('weekly')}
                        >
                            Weekly Forecast
                        </span>
                    </div>

                    <div className="sheet-divider"></div>

                    <div className="forecast-row">
                        {forecastData.map((item, i) => (
                            <div
                                key={`${activeTab}-${i}`}
                                className={`forecast-card ${item.active ? 'active' : ''} ${selectedCard === i ? 'selected' : ''} fade-in`}
                                style={{ animationDelay: `${i * 0.07}s` }}
                                onClick={() => handleCardClick(i)}
                            >
                                <span className="fc-time">{item.time}</span>
                                <div className="fc-icon-wrap">
                                    <span className="fc-icon">{item.icon}</span>
                                    {item.chance && <span className="fc-chance">{item.chance}</span>}
                                </div>
                                <span className="fc-temp">{item.temp}</span>
                            </div>
                        ))}
                    </div>

                    <div className="sheet-bottom-nav">
                        <div className="nav-wave">
                            <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#262C51" />
                                        <stop offset="100%" stopColor="#3E3F74" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,80 C120,80 150,20 250,20 C350,20 380,80 500,80 L500,150 L0,150 Z" fill="url(#waveGradient)" />
                                <path d="M0,80 C120,80 150,20 250,20 C350,20 380,80 500,80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                            </svg>
                        </div>

                        <div
                            className={`nav-plus ${plusRotated ? 'rotated' : ''}`}
                            onClick={() => setPlusRotated(!plusRotated)}
                        >
                            <img src="/Images/Button2.png" alt="Add" className="nav-btn-img" />
                        </div>

                        <div className="nav-items">
                            <div className="nav-icon nav-interactive">
                                <img src="/Images/Map.png" alt="Map" className="nav-img" />
                            </div>
                            <div className="nav-space"></div>
                            <div className="nav-icon nav-interactive">
                                <img src="/Images/List.png" alt="List" className="nav-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LetsGo