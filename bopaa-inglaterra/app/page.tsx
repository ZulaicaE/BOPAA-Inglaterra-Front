import styles from "./page.module.css";
import { NavBar } from "./components/navBar/NavBar";
import { Introduccion } from "./components/introduccion/Introduccion";
import { Footer } from "./components/footer/Footer";
import GraficoCotizaciones from "./components/graficas/GraficoCotizaciones";
import GraficoBolsas from "./components/graficas/GraficoBolsas";
import GraficoTorta from "./components/graficas/GraficoTorta";

export default function Home() {
  return (
    <main className={styles.main}>
      <NavBar />
      <Introduccion/>
      <GraficoCotizaciones />
      <GraficoBolsas />
      <GraficoTorta />
      <Footer/>
    </main>
  );
}
