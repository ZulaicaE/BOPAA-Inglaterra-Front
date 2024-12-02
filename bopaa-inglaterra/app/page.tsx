import styles from "./page.module.css";
import { NavBar } from "./components/navBar/NavBar";
import { Introduccion } from "./components/introduccion/Introduccion";
import { Footer } from "./components/footer/Footer";
import GraficoCotizaciones from "./components/graficas/GraficoCotizaciones";
import GraficoBolsas from "./components/graficas/GraficoBolsas";

export default function Home() {
  return (
    <main className={styles.main}>
      <NavBar />
      <Introduccion/>
      <GraficoCotizaciones />
      <GraficoBolsas />
      <Footer/>
    </main>
  );
}
