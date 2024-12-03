"use client";

import './GraficoTorta.css';
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { getEmpresas } from "@/app/services/Empresas";
import { getCotizacionesByFecha } from "@/app/services/Empresas";

const options = {
  title: "Participación de empresas en la bolsa de Londres",
  is3D: true, // Activar 3D
  sliceVisibilityThreshold: 0,
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
  const cambioMoneda: number = 0.79;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value);
  };

  // Función para obtener la última fecha de cotización
  const fetchUltimaFecha = async () => {
    try {
      const empresasDB = await getEmpresas();
      if (empresasDB.length > 0) {
        // Obtener la última fecha de cotización disponible de la primera empresa (o ajusta según tus necesidades)
        const cotizaciones = await getCotizacionesByFecha(empresasDB[0].codigoEmpresa, "2024-01-01T00:00", new Date().toISOString().split('T')[0]);
        if (cotizaciones.length > 0) {
          // Obtener la última cotización y combinar fecha y hora en el formato correcto
          const ultimaCotizacion = cotizaciones[cotizaciones.length - 1];
          const fechaFormateada = `${ultimaCotizacion.fecha}T${ultimaCotizacion.hora}`;
          setFecha(fechaFormateada);
        }
      }
    } catch (error) {
      console.log("Error al obtener la última fecha de cotización:", error);
    }
  };

  useEffect(() => {
    // Llamar a la función para obtener la última fecha cuando se monte el componente
    fetchUltimaFecha();
  }, []);

  useEffect(() => {
    const fetchDatosGrafico = async () => {
      if (!fecha) return;

      try {
        const empresasDB = await getEmpresas();

        const datos = [["Empresa", "Participación"]];

        for (const empresa of empresasDB) {
          const cotizaciones = await getCotizacionesByFecha(empresa.codigoEmpresa, fecha, fecha);

          console.log(cotizaciones);
          if (cotizaciones.length > 0) {
            const cotizacionHora = cotizaciones[0].cotizacion; // Valor de la cotización
            const participacion = cambioMoneda * (empresa.acciones * cotizacionHora);
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
    <div className="grafico-container-torta">
      {datosGrafico.length > 1 ? (
        <Chart
          chartType="PieChart"
          data={datosGrafico}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      ) : (
        <p className="grafico-torta-error">Introduce una fecha valida para cargar el gráfico...</p>
      )}
      <div className="fecha-input">
        <label htmlFor="fecha">Selecciona una fecha y hora:</label>
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