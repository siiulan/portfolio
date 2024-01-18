export default function AboutMe() {
  return (
    <section id="AboutMe">
      <video className="about-me-video" src='/videos/about_me_bg_2.mp4' autoPlay loop muted />
      <div className="about--section">
        <div className="about--section--img">
          <img src="/images/about_me.jpg" alt="About Me" />
        </div>
        <div className="hero--section--content--box about--section--box">
          <div className="hero--section--content">
            <p className="section--title">About</p>
            <h1 className="skills-section--heading">About Me</h1>
            <p className="hero--section-description">
              I completed my bachelor degree of Computer Science at University of Maryland - College Park. 
              Then, I moved to Canada to pursue my master degree of Electrical & Computer Engineering (ECE). 
              After the completion of master degree, I started my career path as a software engineer at Everz Microsystem ltd,. 
              From this position, I researched and provided professional and productional-level solution to all engineering tasks.
            </p>
            <p className="hero--section-description">
              In 6 years study of Computer Science and experience of software developement, I showed high confidence on tackling all kinds of engineering problems by and understanding and learning skills quick.
              I believe that, with the glory of being a Science Terp (Student of UMD), I can face and tackle on challenges in software developement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
