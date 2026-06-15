import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LibraryPage } from './pages/LibraryPage';
import { NotesPage } from './pages/NotesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { FragranceDetailPage } from './pages/FragranceDetailPage';
import { StatisticsPage } from './pages/StatisticsPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/library" replace />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:id" element={<FragranceDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
    </Routes>
  );
}
