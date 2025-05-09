import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as XLSX from 'xlsx'
import './style.css'

const defaultVini = [
  { nome: "Prosecco DOC", categoria: "bollicine", giacenza: 0, sogliaMinima: 1 },
  { nome: "Chardonnay", categoria: "bianchi", giacenza: 0, sogliaMinima: 2 },
  { nome: "Sangiovese", categoria: "rossi", giacenza: 0, sogliaMinima: 3 },
  { nome: "Cerasuolo d’Abruzzo", categoria: "rosati", giacenza: 0, sogliaMinima: 1 }
]

const getColoreCategoria = (categoria) => {
  switch (categoria) {
    case 'bollicine': return '#F9E79F'
    case 'bianchi': return '#F4D03F'
    case 'rossi': return '#C0392B'
    case 'rosati': return '#BB8FCE'
    default: return '#E9D8A6'
  }
}

const App = () => {
  const [vini, setVini] = useState(() => {
    const salvati = localStorage.getItem("vini")
    return salvati ? JSON.parse(salvati) : defaultVini
  })
  const [modificaIndex, setModificaIndex] = useState(null)
  const [codiceInput, setCodiceInput] = useState("")
  const [soloInAllerta, setSoloInAllerta] = useState(false)

  useEffect(() => {
    localStorage.setItem("vini", JSON.stringify(vini))
  }, [vini])

  const aggiornaGiacenza = (index, delta) => {
    const aggiornati = [...vini]
    aggiornati[index].giacenza = Math.max(0, aggiornati[index].giacenza + delta)
    setVini(aggiornati)
  }

  const aggiornaSoglia = (index, nuovaSoglia) => {
    const aggiornati = [...vini]
    aggiornati[index].sogliaMinima = nuovaSoglia
    setVini(aggiornati)
  }

  const handleSogliaClick = (index) => {
    setModificaIndex(index)
    setCodiceInput("")
  }

  const handleCodiceSubmit = (e) => {
    if (e.key === "Enter") {
      if (codiceInput === "1909") {
        const nuovaSoglia = prompt("Inserisci nuova soglia:")
        if (nuovaSoglia !== null && !isNaN(nuovaSoglia)) {
          aggiornaSoglia(modificaIndex, parseInt(nuovaSoglia))
        }
      } else {
        alert("Codice errato")
      }
      setModificaIndex(null)
    }
  }

  const esportaExcel = () => {
    const dati = vini.map(v => ({
      Nome: v.nome,
      Categoria: v.categoria,
      Giacenza: v.giacenza,
      Soglia: v.sogliaMinima
    }))
    const foglio = XLSX.utils.json_to_sheet(dati)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, foglio, "Giacenze")
    XLSX.writeFile(wb, "report_vini.xlsx")
  }

  const viniDaMostrare = soloInAllerta
    ? vini.filter(v => v.giacenza <= v.sogliaMinima)
    : vini

  const categorie = Array.from(new Set(viniDaMostrare.map(v => v.categoria)))

  return (
    <div style={{ paddingBottom: '70px', fontFamily: 'sans-serif' }}>
      <img src="/logo.png" alt="WineApp Logo" style={{ width: '150px', marginTop: '20px' }} />
      <h2 style={{ color: '#E9D8A6' }}>Lista Vini</h2>

      {categorie.map((cat, idx) => (
        <div key={idx}>
          <h3 style={{
            color: getColoreCategoria(cat),
            borderBottom: `1px solid ${getColoreCategoria(cat)}`,
            marginTop: '20px'
          }}>
            {cat.toUpperCase()}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {viniDaMostrare.map((vino, index) => {
              if (vino.categoria !== cat) return null
              const isAlert = vino.giacenza <= vino.sogliaMinima
              return (
                <li key={index} style={{
                  margin: '10px 0',
                  padding: '10px',
                  backgroundColor: isAlert ? '#F9E79F44' : 'transparent',
                  color: getColoreCategoria(vino.categoria),
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderRadius: '6px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>{vino.nome}</span>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '10px',
                      color: '#E9D8A6'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => aggiornaGiacenza(index, -1)} style={{
                          backgroundColor: '#C0392B', color: 'white', border: 'none',
                          borderRadius: '50%', width: '24px', height: '24px', fontSize: '16px'
                        }}>−</button>
                        <span style={{
                          background: '#fff', color: '#0F1A2B', padding: '3px 10px',
                          borderRadius: '5px', minWidth: '30px', textAlign: 'center',
                          fontSize: '14px'
                        }}>
                          {vino.giacenza}
                        </span>
                        <button onClick={() => aggiornaGiacenza(index, 1)} style={{
                          backgroundColor: '#27AE60', color: 'white', border: 'none',
                          borderRadius: '50%', width: '24px', height: '24px', fontSize: '16px'
                        }}>+</button>
                      </div>
                      <span style={{ marginTop: '4px' }}>GIACENZA</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label
                      style={{ color: '#E9D8A6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleSogliaClick(index)}
                    >
                      Soglia: 
                      <span style={{
                        background: '#fff', color: '#0F1A2B', padding: '3px 10px',
                        borderRadius: '5px', minWidth: '30px', textAlign: 'center',
                        fontSize: '14px'
                      }}>
                        {vino.sogliaMinima}
                      </span>
                      {isAlert && <span style={{ color: '#F1C40F', fontWeight: 'bold' }}>⚠️</span>}
                    </label>
                    {modificaIndex === index && (
                      <input
                        type="password"
                        value={codiceInput}
                        onChange={(e) => setCodiceInput(e.target.value)}
                        onKeyDown={handleCodiceSubmit}
                        autoFocus
                        placeholder="codice"
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '70px' }}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#0F1A2B',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        borderTop: '1px solid #E9D8A6'
      }}>
        <button onClick={() => setSoloInAllerta(prev => !prev)} style={{
          padding: '10px 16px',
          fontSize: '14px',
          backgroundColor: '#E9D8A6',
          color: '#0F1A2B',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          {soloInAllerta ? 'Mostra tutti' : 'Mostra solo in allerta'}
        </button>
        <button onClick={esportaExcel} style={{
          padding: '10px 16px',
          fontSize: '14px',
          backgroundColor: '#E9D8A6',
          color: '#0F1A2B',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Esporta report Excel
        </button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
