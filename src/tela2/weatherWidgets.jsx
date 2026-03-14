import { useEffect, useMemo, useState } from 'react'
import './weatherWidgets.css'

const cardsTop = [
    {
        temp: '19°',
        high: '24°',
        low: '18°',
        city: 'Montreal, Canada',
        condition: 'Mid Rain',
        icon: '/Images/Moon cloud mid rain.png',
    },
    {
        temp: '20°',
        high: '21°',
        low: '-19°',
        city: 'Toronto, Canada',
        condition: 'Fast Wind',
        icon: '/Images/Moon cloud fast wind.png',
    },
    {
        temp: '13°',
        high: '16°',
        low: '8°',
        city: 'Tokyo, Japon',
        condition: 'Showers',
        icon: '/Images/Sun cloud angled rain.png',
    },
    {
        temp: '23°',
        high: '26°',
        low: '16°',
        city: 'Tennessee, United States',
        condition: 'Tornado',
        icon: '/Images/Tornado.png',
    },
]

const cardsBottom = [
    {
        temp: '19°',
        high: '24°',
        low: '18°',
        city: 'Montreal, Canada',
        condition: 'Partly Cloudy',
        icon: '/Images/Moon cloud fast wind.png',
    },
    {
        temp: '19°',
        high: '24°',
        low: '18°',
        city: 'Montreal, Canada',
        condition: 'Partly Cloudy',
        icon: '/Images/Moon cloud fast wind.png',
    },
]

function WeatherCard({ item }) {
    const iconClass = `ww-icon ww-icon-${item.condition.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <article className="ww-card">
            <div className="ww-card-bg-shape" />
            <div className="ww-card-left">
                <h2 className="ww-temp">{item.temp}</h2>
                <p className="ww-range">H:{item.high}  L:{item.low}</p>
                <p className="ww-city">{item.city}</p>
            </div>

            <div className="ww-card-right">
                <img className={iconClass} src={item.icon} alt={item.condition} />
                <p className="ww-condition">{item.condition}</p>
            </div>
        </article>
    )
}

function WeatherWidgets({ onBack }) {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const tick = () => setNow(new Date())
        tick()
        const interval = setInterval(tick, 1000)

        return () => clearInterval(interval)
    }, [])

    const currentTime = useMemo(() => {
        return now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }, [now])

    return (
        <main className="ww-page">
            <div className="ww-phone">
                <div className="ww-header-bar" aria-label="Barra de status e header">
                    <div className="ww-status-bar" aria-label="Barra de status">
                        <div className="ww-dynamic-island" aria-hidden="true"></div>
                        <span className="ww-status-time">{currentTime}</span>
                        <div className="ww-status-icons" aria-hidden="true">
                            <img className="ww-status-right-image" src="/Images/Right%20Side.png" alt="" />
                        </div>
                    </div>
                    <div className="ww-top">
                        <div className="ww-top-row">
                            <button type="button" className="ww-back" onClick={onBack} aria-label="Voltar">
                                <span className="ww-back-icon" aria-hidden="true"></span>
                            </button>
                            <h1 className="ww-title">Weather</h1>
                            <button type="button" className="ww-more" aria-label="Mais opções">
                                <span className="ww-dot" aria-hidden="true"></span>
                                <span className="ww-dot" aria-hidden="true"></span>
                                <span className="ww-dot" aria-hidden="true"></span>
                            </button>
                        </div>
                        <label className="ww-search-wrap" aria-label="Buscar cidade ou aeroporto">
                            <span className="ww-search-icon" aria-hidden="true"></span>
                            <input
                                type="text"
                                className="ww-search"
                                placeholder="Search for a city or airport"
                            />
                        </label>
                    </div>
                </div>
                <section className="ww-group">
                    {cardsTop.map((item, index) => (
                        <WeatherCard key={`top-${index}`} item={item} />
                    ))}
                </section>
                <section className="ww-group ww-group-bottom">
                    {cardsBottom.map((item, index) => (
                        <WeatherCard key={`bottom-${index}`} item={item} />
                    ))}
                </section>
            </div>
        </main>
    )
}

export default WeatherWidgets