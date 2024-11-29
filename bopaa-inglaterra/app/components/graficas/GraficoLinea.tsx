'use client';

import { useEffect, useRef } from 'react';
import { createChart, ISeriesApi } from 'lightweight-charts';
import './GraficoLinea.css';

interface ChartData {
  time: string;
  value: number;
}

// Datos de ejemplo
const sampleData: ChartData[] = [
  { time: '2024-11-25', value: 120 },
  { time: '2024-11-26', value: 121 },
  { time: '2024-11-27', value: 122 },
  { time: '2024-11-28', value: 118 },
  { time: '2024-11-29', value: 123 },
];

export const Grafico = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Crear el gráfico
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#f8f9fa' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#e1e3e6' },
        horzLines: { color: '#e1e3e6' },
      },
      timeScale: {
        borderColor: '#d1d4d7',
      },
    });

    // Crear la serie con un color específico
    const lineSeries: ISeriesApi<'Line'> = chart.addLineSeries({
      color: '#2962FF', // Color de la línea
    });

    // Pasar los datos a la serie
    lineSeries.setData(
      sampleData.map(point => ({
        time: point.time,
        value: point.value,
      }))
    );

    // Configurar el redimensionamiento
    const resizeObserver = new ResizeObserver(() => {
      chart.resize(chartContainerRef.current!.clientWidth, 300);
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className='containerGrafico' />;
};