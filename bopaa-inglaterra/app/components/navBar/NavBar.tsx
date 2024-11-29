import './NavBar.css'
import { NavBarDescubrir } from './componentesNavBar/Descubrir';
import { NavBarInversiones } from './componentesNavBar/Inversiones';
import { NavBarMercados } from './componentesNavBar/Mercados';
import { NavBarLogo } from './componentesNavBar/Logo';
import { NavBarNoticias } from './componentesNavBar/Noticias';
import { NavBarComunidad } from './componentesNavBar/Comunidad';
import { NavBarIdioma } from './componentesNavBar/Idioma';

export const NavBar = () => {
  return (
    <nav className='navBar d-flex fixed-top'> 
      <div className='d-flex align-items-center nav-left'>
        <NavBarLogo />
        <NavBarDescubrir />
        <NavBarMercados />
        <NavBarNoticias />
        <NavBarInversiones />
        <NavBarComunidad />
        <NavBarIdioma />
      </div>
    </nav>
  );
}