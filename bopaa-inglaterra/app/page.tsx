import styles from "./page.module.css";
import { NavBar } from "./components/navBar/NavBar";
import { Introduccion } from "./components/introduccion/Introduccion";
import { Footer } from "./components/footer/Footer";

export default function Home() {
  return (
    <main className={styles.main}>
      <NavBar />
      <Introduccion/>
      {/* 
      <IndiceChart/>
       */}
      <Footer/>
    </main>
  );
}
