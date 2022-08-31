import React from 'react';

import { Section, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import { LeftSection } from './HeroStyles';

const Hero = (props) => (
  <Section row nopadding>
    <LeftSection>
      <SectionTitle main center>
        Welcome To <br />
        My Personal Portfolio
      </SectionTitle>
      <SectionText>
        I a software Developer that currently pursue my master of computer engineering program, I have received years of education in computer science, and I have completed multiple SE projects. Find out more about me on this website, and feel free to connect me via my social media.
      </SectionText>
      <Button onClick={() => window.location = 'https://www.linkedin.com/in/zhiyue-gao-752a3715a/'}>
        Connect Me
      </Button>
    </LeftSection>
  </Section>
);

export default Hero;