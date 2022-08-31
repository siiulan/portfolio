import React from 'react';
import { DiGoogleAnalytics, DiAws, DiCloud9, DiFirebase, DiReact, DiZend, DiGit } from 'react-icons/di';
import { Section, SectionDivider, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import { List, ListContainer, ListItem, ListParagraph, ListTitle } from './TechnologiesStyles';
import { FaAws } from 'react-icons/fa';
import { CgFigma } from 'react-icons/cg';
import { MdAnalytics } from 'react-icons/md';

const Technologies = () =>  (
  <Section id="tech">
    <SectionDivider/>
    <SectionTitle>
      Knowledges & Skills
    </SectionTitle>
    <SectionText>
      After receiving years of undergrad education of computer science at <a href="https://www.umd.edu/">UMD</a>, I have acquired my knowledge in the areas of Computer Programming, Object Oriented Programming and Design, Data strucutre, Algorithm, Data Science, Artificial Intelligence, Software Engineering, Mobile Developement (IOS), and Game Design. 
      <br/>
      <br/>
      During the graduate study at <a href = "https://uwaterloo.ca/">UWaterloo</a>, I have acquired advanced knowledge of Software Engineering, Algorithm Design, Software Testing, Quality Assurance and Maintainance.
    </SectionText>
    <List>
      <ListItem>
        <DiReact size="3rem"/>
        <ListContainer>
          <ListTitle>Front-End</ListTitle>
          <ListParagraph>
            Experience with <br />
            React.js, Vue.js, Next.js, and SwiftUI (mobile on IOS)
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <DiFirebase size="3rem"/>
        <ListContainer>
          <ListTitle>Back-End</ListTitle>
          <ListParagraph>
            Experience with <br />
            Building Rest API using node.js <br/>
            Design, Create, query the database using MYSQL
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <CgFigma size="3rem"/>
        <ListContainer>
          <ListTitle>UI/UX</ListTitle>
          <ListParagraph>
            Experience with <br />
            illustration tool e.g., Lucid Chart, Figma
          </ListParagraph>
          </ListContainer>
      </ListItem>
      <ListItem>
        <FaAws size="3rem"/>
        <ListContainer>
          <ListTitle>Cloud Services</ListTitle>
          <ListParagraph>
            Experience with <br />
            configuring, and hosting web application using EC2 from AWS <br/>
            Enabling clouding messaging service using Firebase
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <DiGoogleAnalytics size="3rem"/>
        <ListContainer>
          <ListTitle>Data Science and Statistics</ListTitle>
          <ListParagraph>
            Experience with <br />
            modeling, analyzing and summarizing on real-world open-source databases using<br/>
            R, Panda and NumPy(Python Module), SAS, and Minitab
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <DiGit size="3rem"/>
        <ListContainer>
          <ListTitle>Version Control and Agile Developement</ListTitle>
          <ListParagraph>
            Experience with <br />
            project version mangement using Github & GitLab,<br/>
            and promote agile development using tools like slack, Kanban-board (trello)
          </ListParagraph>
        </ListContainer>
      </ListItem>
    </List>
  </Section>

);

export default Technologies;
