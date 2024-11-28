import { IntroduccionText } from "./componentesIntroduccion/IntroduccionText";
import './Introduccion.css'

export const Introduccion = () => {
  return (
    <nav className='container text-center containerIntroduccion'> 
      <div className='d-flex align-items-center nav-left'>
        <IntroduccionText />
      </div>
    </nav>
  );
}


