import clienteAxios from "./Axios";

export const getBolsas = async (): Promise<any> => {
    const response = await clienteAxios.get('bolsas');
    return response.data;
}

export const getIndicesByFecha = async (codigoBolsa: string, fechaDesde: string, fechaHasta: string): Promise<any> => {
    try {
      const response = await clienteAxios.get(`indices/${codigoBolsa}/cotizaciones`, {
        params: {
          fechaDesde,
          fechaHasta,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }