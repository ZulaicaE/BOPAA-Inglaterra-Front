import { IntroduccionText } from "./componentesIntroduccion/IntroduccionText";
import './Introduccion.css'

export const Introduccion = () => {
  return (
    <nav className='container containerIntroduccion'> 
      <div>
        <IntroduccionText />
      </div>
    </nav>
  );
}


