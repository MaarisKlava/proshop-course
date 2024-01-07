import { Container } from 'react-bootstrap';
// Components
import { Header, Footer } from './components';
// Pages
import { Outlet } from 'react-router-dom';
// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      {/* Anywhere as Toast Container is absolute */}
      <ToastContainer />
    </>
  );
};
export default App;
