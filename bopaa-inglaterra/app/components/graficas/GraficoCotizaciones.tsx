'use client';

import './GraficoCotizaciones.css';
import { getCotizacionesByFecha, getEmpresas } from '@/app/services/Empresas';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';

interface Empresa {
  codigoEmpresa: string;
  nombreEmpresa: string;
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

function GraficosCotizaciones() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string | null>(null);
  const [modoCotizacion, setModoCotizacion] = useState<'horaDelDia' | 'diaDelMes'>('horaDelDia');
  const [datosGrafica, setDatosGrafica] = useState<any[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [mesSeleccionado, setMesSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    const fechaActual = new Date();
    setDiaSeleccionado(fechaActual.toISOString().split('T')[0]); // Establece el día actual como el predeterminado

    const fetchEmpresas = async () => {
      try {
        const empresasDB = await getEmpresas();
        setEmpresas(empresasDB);

        if (empresasDB.length > 0) {
          const primeraEmpresa = empresasDB[0].codigoEmpresa;
          setEmpresaSeleccionada(primeraEmpresa);
        }
      } catch (error) {
        console.log('Error al obtener empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  const handleToggleEmpresa = (codigoEmpresa: string) => {
    const nuevaSeleccion = empresaSeleccionada === codigoEmpresa ? null : codigoEmpresa;
    setEmpresaSeleccionada(nuevaSeleccion);
  };

  const handleModoCambio = (modo: 'horaDelDia' | 'diaDelMes') => {
    setModoCotizacion(modo);
  };

  const cargarDatosGrafica = async () => {
    if (!empresaSeleccionada) {
      console.log('Selecciona una empresa para cargar la gráfica.');
      return;
    }

    const fechaDesde: string = '2024-01-01T00:00';
    const fechaActual: string = new Date().toISOString().slice(0, 16);
    const cambioMoneda: number = 0.79;

    try {
      const cotizaciones = await getCotizacionesByFecha(empresaSeleccionada, fechaDesde, fechaActual);


      let datosConvertidos: any[] = [];
      if (modoCotizacion === 'horaDelDia' && diaSeleccionado) {
        datosConvertidos = [
          ['Hora', 'Cotización'], // Encabezado
          ...cotizaciones
            .filter((cotizacion: any) => cotizacion.fecha === diaSeleccionado)
            .map((cotizacion: any) => [cotizacion.hora, cambioMoneda*(parseFloat(cotizacion.cotizacion))]),
        ];
      } else if (modoCotizacion === 'diaDelMes' && mesSeleccionado) {
        
        const cotizacionesMes = cotizaciones.filter((cotizacion: any) => {  // Filtrar cotizaciones para el mes seleccionado
          const mesCotizacion = cotizacion.fecha.slice(0, 7); // Extrae directamente 'YYYY-MM'
          return mesCotizacion === mesSeleccionado; // Comparar con el mes seleccionado (también en formato 'YYYY-MM')
        });

        // Formatear datos para el gráfico de velas
        const datosVelas = [
          ['Fecha', 'Minimo', 'Apertura', 'Cierre', 'Maximo'],
          ...Object.entries(
            cotizacionesMes.reduce((acc: any, cotizacion: any) => {
              const fecha = cotizacion.fecha;
              const precio = cambioMoneda*(parseFloat(cotizacion.cotizacion));
        
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
  }, [empresaSeleccionada, modoCotizacion, diaSeleccionado, mesSeleccionado]);

  return (
    <div className="grafico-container">
      <div className="containerGrafico">
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
      <div className="containerBotones">
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
        <ButtonGroup className="container-empresas" aria-label="Lista de empresas">
          {empresas.map((empresa) => (
            <Button
              key={empresa.codigoEmpresa}
              variant={empresaSeleccionada === empresa.codigoEmpresa ? 'primary' : 'secondary'}
              className="empresa-button"
              onClick={() => handleToggleEmpresa(empresa.codigoEmpresa)}
            >
              <span className="nombre">{empresa.nombreEmpresa}</span>
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

export default GraficosCotizaciones;