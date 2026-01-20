import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000
const API_KEY = process.env.POLYGON_API_KEY

if (!API_KEY) {
    console.error('❌ POLYGON_API_KEY is missing')
    process.exit(1)
}

app.use(cors())
app.use(express.json())

/* =========================
   POLYGON API
========================= */
app.get('/polygon', async (req, res) => {
    const { ticker, startDate, endDate } = req.query

    if (!ticker || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing parameters' })
    }

    try {
        const url =
          `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=${API_KEY}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Polygon request failed')
        }

        const data = await response.json()
        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Polygon fetch failed' })
    }
})

/* =========================
   AI REPORT
========================= */
function summarizeStockData(stockData) {
    return stockData.map(stock => {
        const prices = stock.results?.map(r => r.c) || []

        if (!prices.length) {
            return { ticker: stock.ticker, error: 'No data' }
        }

        const first = prices[0]
        const last = prices[prices.length - 1]
        const change = (((last - first) / first) * 100).toFixed(2)

        return {
            ticker: stock.ticker,
            startPrice: first,
            endPrice: last,
            changePercent: `${change}%`,
            days: prices.length
        }
    })
}

app.post('/ai-report', async (req, res) => {
    const { stockData } = req.body

    if (!Array.isArray(stockData)) {
        return res.status(400).json({ error: 'Invalid stock data' })
    }

    const summary = summarizeStockData(stockData)

    try {
        const ollamaRes = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                messages: [
                    {
                        role: 'system',
                        content:
                          'You are a financial analyst. Write a clear stock report (max 150 words). Recommend Buy, Hold, or Sell.'
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(summary, null, 2)
                    }
                ],
                stream: false
            })
        })

        const data = await ollamaRes.json()
        res.json({ result: data.message.content })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'AI report failed' })
    }
})

app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`)
})
