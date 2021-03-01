import SvgMuseum from '../icons/Museum';
import SvgBridge from '../icons/Bridge';
import SvgAmphitheatre from '../icons/Amphitheatre';
import SvgTheater from '../icons/Theater'; // Tempel

function Pin(props) {
  const key = props.info.type;
  const size = "35px"

  return (
    <div className="pin" onClick={() => props.PinSetter( props.info ) }>
      {
        {
          'Museum':     <SvgMuseum  width={size}
                        height={size}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 550 550"
                        preserveAspectRatio="none" />,
          'Bridge':     <SvgBridge  width={size}
                        height={size}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 550 550"
                        preserveAspectRatio="none" />,
          'Temple':     <SvgTheater  width={size}
                        height={size}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 550 550"
                        preserveAspectRatio="none" />,
          'Theatre':    <SvgAmphitheatre  width={size}
                        height={size}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 550 550"
                        preserveAspectRatio="none" />,
          'Tmp':       "📌"
        }[key]
      }
    </div>
  );
}
export default (Pin);