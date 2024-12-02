import styles from "./page.module.css";
import { NavBar } from "./components/navBar/NavBar";
import { Introduccion } from "./components/introduccion/Introduccion";
import { Footer } from "./components/footer/Footer";
import GraficoLinea from "./components/graficas/GraficoLinea";

export default function Home() {
  return (
    <main className={styles.main}>
      <NavBar />
      <Introduccion/>
      <GraficoLinea />
      <Footer/>
    </main>
  );
}
