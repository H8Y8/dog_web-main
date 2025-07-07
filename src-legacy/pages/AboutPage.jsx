import PageContainer from '../components/PageContainer';
import About from '../components/About';
import Certificate from '../components/Certificate';
import Members from '../components/Members';

const AboutPage = () => {
  return (
    <PageContainer>
      <About />
      <div data-aos="fade-up">
        <Certificate />
      </div>
      <div data-aos="fade-up">
        <Members />
      </div>
    </PageContainer>
  );
};

export default AboutPage; 