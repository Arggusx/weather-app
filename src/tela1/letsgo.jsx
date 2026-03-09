const LetsGo = () => {
    return (
        <>
            <div className="container">
                <img className="mobile" src="/Image.png" alt="" />
                <img className="house" src="/House.png" alt="" />
                <div className="weather">
                    <div className="local">Montreal</div>
                    <div className="temp">19°</div>
                    <div className="info">
                        <div className="clima">Mostrly Clear</div>
                        <div className="umidade"><span>H:24°</span><span>L:12°</span></div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default LetsGo