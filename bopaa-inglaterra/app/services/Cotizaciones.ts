import clienteAxios from "./Axios";

export const getCotizacionesByFecha = async (codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<any> => {
    const reponse = await clienteAxios.get(`empesas/${codigoEmpresa}/cotizaciones`, {
        params: {
            fechaDesde,
            fechaHasta,
        },
    });
}