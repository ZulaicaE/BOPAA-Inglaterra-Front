'use client';

import './GraficoBolsas.css';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import { getBolsas, getIndicesByFecha } from '@/app/services/Bolsas';

interface Bolsa {
  codigoBolsa: string;
}

export const options = {
    legend: "none",
    bar: { groupWidth: "80%" }, // Remove space between bars.
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
      risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
    },
    line: {
      curveType: 'function',
      pointSize: 5,
    },
    hAxis: {
      title: '',
    },
    vAxis: {
      title: 'Libra Esterlina £',
    }
};


function GraficoBolsas() {
  const [bolsas, setBolsas] = useState<Bolsa[]>([]);
  const [bolsaSeleccionada, setBolsaSeleccionada] = useState<string | null>(null);
  const [modoCotizacion, setModoCotizacion] = useState<'horaDelDia' | 'diaDelMes'>('horaDelDia');
  const [datosGrafica, setDatosGrafica] = useState<any[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [mesSeleccionado, setMesSeleccionado] = useState<string | null>(null);

  const cambioMoneda: number = 0.79;

  useEffect(() => {
    const fechaActual = new Date().toISOString().split('T')[0];
    setDiaSeleccionado(fechaActual); // Establece el día actual como el predeterminado

    const mesActual = new Date().toISOString().slice(0, 7); // Formato 'YYYY-MM'
    setMesSeleccionado(mesActual); // Supone que tienes una función para actualizar mesSeleccionado
  
    const fetchBolsas = async () => {
      try {
        const bolsasDB = await getBolsas();
        setBolsas(bolsasDB);
  
        // Establece 'LSE' como la bolsa predeterminada si existe, o la primera bolsa si no.
        const bolsaPorDefecto = bolsasDB.find((bolsa: { codigoBolsa: string; }) => bolsa.codigoBolsa === 'LSE')?.codigoBolsa || bolsasDB[0]?.codigoBolsa;
        if (bolsaPorDefecto) {
          setBolsaSeleccionada(bolsaPorDefecto);
        }
      } catch (error) {
        console.log('Error al obtener bolsas:', error);
      }
    };
  
    fetchBolsas();
  }, []);

  const handleToggleBolsa = (codigoBolsa: string) => {
    const nuevaSeleccion = bolsaSeleccionada === codigoBolsa ? null : codigoBolsa;
    setBolsaSeleccionada(nuevaSeleccion);
  };

  const handleModoCambio = (modo: 'horaDelDia' | 'diaDelMes') => {
    setModoCotizacion(modo);
  };

  const cargarDatosGrafica = async () => {
    if (!bolsaSeleccionada) {
      console.log('Selecciona una empresa para cargar la gráfica.');
      return;
    }

    const fechaDesde: string = '2024-01-01T00:00';
    const fechaActual: string = new Date().toISOString().slice(0, 16);

    try {
      const indices = await getIndicesByFecha(bolsaSeleccionada, fechaDesde, fechaActual);

      let datosConvertidos: any[] = [];
      if (modoCotizacion === 'horaDelDia' && diaSeleccionado) {
        datosConvertidos = [
          ['Hora', 'Cotización'], // Encabezado
          ...indices
            .filter((indice: any) => indice.fecha === diaSeleccionado)
            .map((indice: any) => [indice.hora, cambioMoneda*(parseFloat(indice.valor))]),
        ];
      } else if (modoCotizacion === 'diaDelMes' && mesSeleccionado) {
        
        const indicesMes = indices.filter((indice: any) => {  // Filtrar cotizaciones para el mes seleccionado
          const mesIndice = indice.fecha.slice(0, 7); // Extrae directamente 'YYYY-MM'
          return mesIndice === mesSeleccionado; // Comparar con el mes seleccionado (también en formato 'YYYY-MM')
        });

        // Formatear datos para el gráfico de velas
        const datosVelas = [
          ['Fecha', 'Minimo', 'Apertura', 'Cierre', 'Maximo'],
          ...Object.entries(
            indicesMes.reduce((acc: any, indice: any) => {
              const fecha = indice.fecha;
              const precio = cambioMoneda*(parseFloat(indice.valor));
        
              if (!acc[fecha]) {
                acc[fecha] = {
                  fecha,
                  minimo: precio,
                  apertura: precio,
                  cierre: precio,
                  maximo: precio,
                };
              } else {
                acc[fecha].cierre = precio; // Actualiza el cierre al precio más reciente de la fecha.
                acc[fecha].maximo = Math.max(acc[fecha].maximo, precio);
                acc[fecha].minimo = Math.min(acc[fecha].minimo, precio);
              }
        
              return acc;
            }, {})
          ).map(([fecha, valores]: [string, any]) => {
            // Construye el array en el formato esperado.
            return [fecha, valores.minimo, valores.apertura, valores.cierre, valores.maximo];
          }),
        ];
      
        datosConvertidos = datosVelas;
      }
      setDatosGrafica(datosConvertidos);
    } catch (error) {
      console.log('Error al cargar datos de la gráfica:', error);
    }
  };

  useEffect(() => {
    cargarDatosGrafica();
  }, [bolsaSeleccionada, modoCotizacion, diaSeleccionado, mesSeleccionado]);

  return (
    <div className="grafico-container">
      <div className="container-grafico">
        {datosGrafica.length > 0 ? (
          <Chart
            chartType={modoCotizacion === 'diaDelMes' ? 'CandlestickChart' : 'LineChart'}
            width="100%"
            height="400px"
            data={datosGrafica}
            options={options}
          />
        ) : (
          <p>Selecciona una empresa y un modo para ver la gráfica.</p>
        )}
      </div>

      {/* Botones */}
      <div className="container-botones">
        {/* Selector de día */}
        {modoCotizacion === 'horaDelDia' && (
          <Form.Group controlId="selectorDia">
            <Form.Label>Selecciona un día</Form.Label>
            <Form.Control
              type="date"
              value={diaSeleccionado || ''}
              onChange={(e) => setDiaSeleccionado(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Selector de mes */}
        {modoCotizacion === 'diaDelMes' && (
          <Form.Group controlId="selectorMes">
            <Form.Label>Selecciona un mes</Form.Label>
            <Form.Control
              type="month"
              value={mesSeleccionado || ''}
              onChange={(e) => setMesSeleccionado(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Botones de Empresa */}
        <ButtonGroup className="container-bolsas" aria-label="Lista de bolsas">
          {bolsas.map((bolsa) => (
            <Button
              key={bolsa.codigoBolsa}
              variant={bolsaSeleccionada === bolsa.codigoBolsa ? 'primary' : 'secondary'}
              className="bolsa-button"
              onClick={() => handleToggleBolsa(bolsa.codigoBolsa)}
            >
              <span className="nombre">{bolsa.codigoBolsa}</span>
            </Button>
          ))}
        </ButtonGroup>

        {/* Botones de Modo de Cotización */}
        <ButtonGroup className="modo-cotizacion-buttons" aria-label="Modo de Cotización">
          <Button
            variant={modoCotizacion === 'horaDelDia' ? 'primary' : 'secondary'}
            onClick={() => handleModoCambio('horaDelDia')}
          >
            Cotización por Hora del Día
          </Button>
          <Button
            variant={modoCotizacion === 'diaDelMes' ? 'primary' : 'secondary'}
            onClick={() => handleModoCambio('diaDelMes')}
          >
            Cotización por Día del Mes
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default GraficoBolsas;