// Codice React aggiornato con lista vini completa per defaultVini (suddivisa per categorie)

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as XLSX from 'xlsx'
import './style.css'

const ImportaVini = ({ onImporta }) => {
  const [testo, setTesto] = useState("")

  const parseVini = () => {
    const righe = testo.split(/\r?\n/)
    const nuoviVini = []
    let categoriaCorrente = ""

    righe.forEach(riga => {
      const linea = riga.trim()
      if (!linea) return

      const cat = linea.toLowerCase()
      if (["bollicine", "bianchi", "rossi", "rosati"].includes(cat)) {
        categoriaCorrente = cat
      } else {
        nuoviVini.push({ nome: linea, categoria: categoriaCorrente, giacenza: 0, sogliaMinima: 0 })
      }
    })

    if (nuoviVini.length === 0) return alert("Lista non valida o vuota")

    if (window.confirm("Sei sicuro di voler sostituire tutta la lista vini?")) {
      onImporta(nuoviVini)
    }
  }

  return (
    <div style={{ padding: '20px', background: '#19212C', color: '#E9D8A6' }}>
      <h3>Incolla nuova lista vini</h3>
      <textarea
        value={testo}
        onChange={e => setTesto(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '10px', fontFamily: 'monospace' }}
        placeholder={`Esempio:\nBOLLICINE\nMetodo Classico BdB\nPignoletto Brut Bio\n\nBIANCHI\nChardonnay\nSauvignon`}
      />
      <button onClick={parseVini} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#E9D8A6', color: '#19212C', fontWeight: 'bold' }}>
        Importa lista vini
      </button>
    </div>
  )
}

const defaultVini = [
  { nome: "Metodo Classico BdB Villa Amagioia, Varignana, Bologna", categoria: "bollicine", giacenza: 0, sogliaMinima: 0 },
  { nome: "Pignoletto Brut Bio Montevecchio Isolani, Bologna", categoria: "bollicine", giacenza: 0, sogliaMinima: 0 },
  { nome: "Rosso Bologna Riserva Montevecchio Isolani", categoria: "rossi", giacenza: 0, sogliaMinima: 0 },
  { nome: "Sangiovese Superiore Fratta Minore, Bologna", categoria: "rossi", giacenza: 0, sogliaMinima: 0 }
  // ... Altri vini da completare
]

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