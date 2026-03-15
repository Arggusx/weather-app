import { useEffect, useMemo, useState } from 'react'
import './weatherWidgets.css'
import Locales from '../data/locales.json'

function WeatherCard({ item }) {
    const weatherImages = {
        "céu limpo": "/Images/Sun cloud mid rain.png",
        "nuvens dispersas": "/Images/Moon cloud fast wind.png",
        "algumas nuvens": "/Images/Moon cloud fast wind.png",
        "nuvens quebradas": "/Images/Moon cloud fast wind.png",
        "nublado": "/Images/Moon cloud fast wind.png",
        "chuva moderada": "/Images/Sun cloud mid rain.png",
        "chuva leve": "/Images/Sun cloud angled rain.png",
        "chuva forte": "/Images/Sun cloud mid rain.png",
        "garoa": "/Images/Sun cloud angled rain.png",
        "trovoada": "/Images/Moon cloud mid rain.png",
        "nevoeiro": "/Images/Moon cloud fast wind.png",
        "tornado": "/Images/Tornado.png",
    };


    const [weatherData, setWeatherData] = useState(null)
    const apiKey = import.meta.env.VITE_API_WEATHER_KEY
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&appid=${apiKey}&units=metric&lang=pt_br`

    useEffect(() => {
        if (!item.lat || !item.lon) return
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) setWeatherData(data)
            })
            .catch(error => console.error('Erro na API:', error))
    }, [apiUrl, item.lat, item.lon]);

    if (!weatherData) {
        return (
            <div className='ww-card-loading' style={{ color: 'white', padding: '20px' }}>
                Carregando...
            </div>
        )
    }

    const description = weatherData.weather[0].description.toLowerCase();
    const customIcon = weatherImages[description] || "/Images/Sun cloud mid rain.png";

    const temp = `${Math.round(weatherData.main.temp)}°`
    const high = `${Math.round(weatherData.main.temp_max)}°`
    const low = `${Math.round(weatherData.main.temp_min)}°`
    const conditionText = weatherData.weather[0].description
    const cityName = weatherData.name
    const countryTag = weatherData.sys.country
    const countryName = new Intl.DisplayNames(['pt-BR'], { type: 'region' }).of(countryTag)

    const conditionMain = weatherData.weather[0].main.toLowerCase()
    const iconClass = `ww-icon ww-icon-${conditionMain.replace(/\s+/g, '-')}`
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

    return (
        <article className="ww-card">
            <div className="ww-card-bg-shape" />
            <div className="ww-card-left">
                <h2 className="ww-temp">{temp}</h2>
                <p className="ww-range">H:{high}  L:{low}</p>

                <p className="ww-city">{cityName}, {countryName}</p>

            </div>

            <div className="ww-card-right">
                <img className={iconClass} src={customIcon} alt={description} />
                <p className="ww-condition">{description}</p>
            </div>
        </article>
    )
}

function WeatherWidgets({ onBack }) {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const tick = () => setNow(new Date())
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
                <div className="ww-header-bar">
                    <div className="ww-status-bar">
                        <div className="ww-dynamic-island"></div>
                        <span className="ww-status-time">{currentTime}</span>
                        <div className="ww-status-icons">
                            <img className="ww-status-right-image" src="/Images/Right Side.png" alt="" />
                        </div>
                    </div>
                    <div className="ww-top">
                        <div className="ww-top-row">
                            <button type="button" className="ww-back" onClick={onBack}>
                                <span className="ww-back-icon"></span>
                            </button>
                            <h1 className="ww-title">Weather</h1>
                        </div>
                        <label className="ww-search-wrap">
                            <span className="ww-search-icon"></span>
                            <input
                                type="text"
                                className="ww-search"
                                placeholder="Search for a city or airport"
                            />
                        </label>
                    </div>
                </div>

                <section className="ww-group">
                    {Locales.map((item, index) => (
                        <WeatherCard key={`city-${index}`} item={item} />
                    ))}
                </section>
            </div>
        </main>
    )
}

export default WeatherWidgets