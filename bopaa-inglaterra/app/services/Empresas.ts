import clienteAxios from "./Axios";

export const getEmpresas = async (): Promise<any> => {
    const response = await clienteAxios.get('empresas');
    return response.data;
}


export const getCotizacionesByFecha = async (codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<any> => {
    try {
    const response = await clienteAxios.get(`empresas/${codigoEmpresa}/cotizaciones`, {
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