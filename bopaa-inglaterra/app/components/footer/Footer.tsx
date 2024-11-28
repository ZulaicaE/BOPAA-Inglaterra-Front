import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerTop">
        <ul className="footerLinks">
          <li><a href="#" className="footerLink">Quiénes somos</a></li>
          <li><a href="#" className="footerLink">Nuestra Historia</a></li>
          <li><a href="#" className="footerLink">Noticias y Perspectivas</a></li>
          <li><a href="#" className="footerLink">Eventos</a></li>
          <li><a href="#" className="footerLink">Contactar</a></li>
        </ul>
      </div>
      <div className="footerBottom">
        <p>&copy; 2024 London Stock Exchange Group. Todos los derechos reservados.</p>
        <ul className="footerBottomLinks">
          <li><a href="#">Política de Privacidad</a></li>
          <li><a href="#">Términos de Uso</a></li>
          <li><a href="#">Accesibilidad</a></li>
          <li><a href="#">Mapa del Sitio</a></li>
        </ul>
      </div>
    </footer>
  );
};