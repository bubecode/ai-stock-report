import { dates } from '/utils/dates.js'

/* =========================
   STATE
========================= */
const tickersArr = []

const generateReportBtn = document.querySelector('.generate-report-btn')
const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')

/* =========================
   EVENTS
========================= */
generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const tickerInput = document.getElementById('ticker-input')
    const label = document.getElementsByTagName('label')[0]

    if (tickerInput.value.length > 2) {
        label.style.color = ''
        label.textContent = 'Enter ticker'
        generateReportBtn.disabled = false

        tickersArr.push(tickerInput.value.toUpperCase())
        tickerInput.value = ''
        renderTickers()
    } else {
        label.style.color = 'red'
        label.textContent =
            'Ticker must be at least 3 characters (e.g. TSLA)'
    }
})

/* =========================
   RENDER TICKERS
========================= */
function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display')
    tickersDiv.innerHTML = ''

    tickersArr.forEach((ticker) => {
        const span = document.createElement('span')
        span.textContent = ticker
        span.classList.add('ticker')
        tickersDiv.appendChild(span)
    })
}

/* =========================
   FETCH STOCK DATA
========================= */
async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    apiMessage.innerText = 'Fetching stock data...'

    try {
        const stockData = await Promise.all(
            tickersArr.map(fetchTickerData)
        )

        apiMessage.innerText = 'Creating report...'
        await fetchReport(stockData)

    } catch (err) {
        console.error(err)
        loadingArea.innerText = 'Error fetching stock data.'
    }
}

/* =========================
   FETCH SINGLE TICKER
========================= */
async function fetchTickerData(ticker) {
    const params = new URLSearchParams({
        ticker,
        startDate: dates.startDate,
        endDate: dates.endDate
    })

    const res = await fetch(
        `http://localhost:3000/polygon?${params}`
    )

    if (!res.ok) {
        throw new Error(`Failed to fetch ${ticker}`)
    }

    return await res.json()
}


async function fetchReport(stockData) {
    try {
        const res = await fetch('http://localhost:3000/ai-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stockData })
        })

        if (!res.ok) {
            throw new Error('AI report failed')
        }

        const data = await res.json()
        renderReport(data.result)

    } catch (err) {
        console.error(err)
        loadingArea.innerText =
            'Unable to access AI. Please refresh and try again.'
    }
}

/* =========================
   RENDER REPORT
========================= */
function renderReport(output) {
    loadingArea.style.display = 'none'

    const outputArea = document.querySelector('.output-panel')
    outputArea.innerHTML = ''

    const report = document.createElement('p')
    report.textContent = output

    outputArea.appendChild(report)
    outputArea.style.display = 'flex'
}
