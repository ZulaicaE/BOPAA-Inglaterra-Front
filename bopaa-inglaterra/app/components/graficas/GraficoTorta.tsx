"use client";

import './GraficoTorta.css';
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { getEmpresas } from "@/app/services/Empresas";
import { getCotizacionesByFecha } from "@/app/services/Empresas";

const options = {
  title: "Participación de Empresas en la Bolsa",
  is3D: true, // Activar 3D
  legend: {
    position: "bottom",
    alignment: "center",
    textStyle: {
      fontSize: 12,
    },
  },
  colcolors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A", "#A2D6C4", "#C2A3D1"],
};

function GraficoTorta() {
  const [datosGrafico, setDatosGrafico] = useState<any[]>([]);
  const [fecha, setFecha] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value);
  };

  useEffect(() => {
    const fetchDatosGrafico = async () => {
      if (!fecha) return;

      try {
        const empresasDB = await getEmpresas();

        const datos = [["Empresa", "Participación"]];

        for (const empresa of empresasDB) {
          const cotizaciones = await getCotizacionesByFecha(empresa.codigoEmpresa, fecha, fecha); // Fecha exacta, misma para desde y hasta);

          console.log(cotizaciones);
          if (cotizaciones.length > 0) {
            const cotizacionHora = cotizaciones[0].cotizacion; // Valor de la cotización
            const participacion = empresa.acciones * cotizacionHora;
            datos.push([empresa.nombreEmpresa, participacion]);
          }
        }

        setDatosGrafico(datos);
      } catch (error) {
        console.log("Error al obtener datos del gráfico:", error);
      }
    };

    fetchDatosGrafico();
  }, [fecha]);

  return (
    <div className="grafico-container">
      {datosGrafico.length > 1 ? (
        <Chart
          chartType="PieChart"
          data={datosGrafico}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      ) : (
        <p>Introduce una fecha para cargar el gráfico...</p>
      )}
      <div className="fecha-input">
        <label htmlFor="fecha">Selecciona una fecha y hora (YYYY-MM-DDTHH:MM):</label>
        <input
          type="datetime-local"
          id="fecha"
          value={fecha}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}

export default GraficoTorta;
