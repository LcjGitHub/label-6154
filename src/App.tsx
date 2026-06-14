import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LibraryPage } from './pages/LibraryPage';
import { NotesPage } from './pages/NotesPage';

/**
 * 应用路由
 */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/library" replace />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="notes" element={<NotesPage />} />
      </Route>
    </Routes>
  );
}
