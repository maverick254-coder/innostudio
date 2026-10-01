import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Works from '../pages/Works.jsx'
import Project from '../pages/Project.jsx'
import Toolstack from '../pages/Toolstack.jsx'
import Contact from '../pages/Contact.jsx'
import NotFound from '../pages/NotFound.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/works" element={<Works />} />
        <Route path="/work/:slug" element={<Project />} />
        <Route path="/toolstack" element={<Toolstack />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
