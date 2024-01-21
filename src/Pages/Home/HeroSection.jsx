import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"

export default function HeroSection() {

  const handleButtonClick = (buttonName) => {
    // Redirect to the desired URL
    switch(buttonName){
      case 'connect':
        location.href = 'https://www.linkedin.com/in/ryan-gao-752a3715a/';
        break;
      default:
        break;
    }
  };

  const overview = ['Innovative software engineer driven by the passion to arts and design', 'Compassionate and knowledgeable programming educator that supports students of all ages and levels']

  return (
    <section id="heroSectionCover" className="hero--section">
      <video className = "hero--section--video" src= {process.env.PUBLIC_URL + '/videos/video-4.mp4'} autoPlay loop muted />
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <p className="section--title">Full Stack Developer & Graphic Designer</p>
          <h1 className="hero--section--title">
            <span className="hero--section-title--color">Ryan</span>{""}
            <br />
            Gao
          </h1>
          <p className="hero--section-description">
          {overview.map((item, index) => (
            <span key={index}>
              {item}
              {index !== overview.length - 1 && <br />}
            </span>
          ))}
          </p>
          <button onClick={() => handleButtonClick('connect')} className="btn btn-primary">Connect</button>
        </div>
      </div>
      {/* <div className="hero--section--img">
        <img src="./img/logo-expansion.png" alt="Hero Section" />
      </div> */}
    </section>
  );
}
