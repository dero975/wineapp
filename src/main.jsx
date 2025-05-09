// Codice React aggiornato con lista vini completa per defaultVini (suddivisa per categorie)

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as XLSX from 'xlsx'
import './style.css'

// ... [ImportaVini + defaultVini definiti qui sopra come già presenti] ...

const App = () => {
  const [vini, setVini] = useState(() => {
    const salvati = localStorage.getItem("vini")
    return salvati ? JSON.parse(salvati) : defaultVini
  })

  useEffect(() => {
    localStorage.setItem("vini", JSON.stringify(vini))
  }, [vini])

  const categorie = Array.from(new Set(vini.map(v => v.categoria)))

  return (
    <div style={{ padding: '20px', backgroundColor: '#19212C', color: '#E9D8A6', minHeight: '100vh' }}>
      <h1>WINEAPP</h1>
      <ImportaVini onImporta={setVini} />

      {categorie.map((categoria) => (
        <div key={categoria}>
          <h2 style={{ borderBottom: '1px solid #E9D8A6' }}>{categoria.toUpperCase()}</h2>
          <ul>
            {vini.filter(v => v.categoria === categoria).map((vino, i) => (
              <li key={i} style={{ margin: '8px 0' }}>{vino.nome}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)