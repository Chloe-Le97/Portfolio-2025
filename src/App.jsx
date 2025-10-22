import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Footer, Navbar } from "./components";
import { Contact, SceneManager } from "./pages";

const App = () => {
  return (
    <main className='bg-slate-300/20'>
      <Router>
        <Suspense fallback={
          <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm'>
            <div className='flex flex-col items-center gap-3 px-4 py-3 rounded-xl bg-white/90 shadow-md border border-black/10'>
              <div className='w-10 h-10 border-2 border-opacity-20 border-blue-500 border-t-blue-500 rounded-full animate-spin'></div>
              <div className='text-sm font-medium text-slate-700'>Loading...</div>
            </div>
          </div>
        }>
          <Navbar />
          <Routes>
            <Route path='/' element={<SceneManager />} />
            <Route
              path='/*'
              element={
                <>
                  <Routes>
                    <Route path='/contact' element={<Contact />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </main>
  );
};

export default App;
