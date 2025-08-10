import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { PropertiesPage } from './components/PropertiesPage';
import { PropertiesPageSimple } from './components/PropertiesPageSimple';
import { ChatPage } from './components/ChatPage';
import { CalendarPage } from './components/CalendarPage';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { LoginPage } from './components/LoginPage';
import { NotFoundPage } from './components/NotFoundPage';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen w-full bg-background text-foreground">
        <Routes>
          {/* Login route without navigation */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Routes with navigation */}
          <Route path="/*" element={
            <>
              <Navigation />
              <main className="w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/property/:id" element={<PropertyDetailPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAuth={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  {/* 404 page for any unmatched routes */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;