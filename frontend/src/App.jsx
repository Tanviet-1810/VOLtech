import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/main-layout/MainLayout.jsx';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home.jsx';
import Profile from './pages/profile/Profile.jsx';
import AuthContextProvider from './contexts/auth/AuthContextProvider.jsx';
import { ROUTES } from './const/route.js';
import AlignCenterLayout from './components/layout/align-center-layout/AlignCenterLayout.jsx';
import ActivePage from './pages/active/ActivePage.jsx';
import NotFoundPage from './pages/not-found/NotFoundPage.jsx';
import ActiveDetailPage from './pages/active-detail/ActiveDetailPage.jsx';
import AboutPage from './pages/about/AboutPage.jsx';
import RankPage from './pages/rank/RankPage.jsx';
import EditProfilePage from './pages/edit-profile/EditProfilePage.jsx';
import { USER_ROLE } from './const/user-role.js';
import ManageActivePage from './pages/manage-active/ManageActivePage.jsx';

const App = () => {
	return (
		<AuthContextProvider>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path={ROUTES.HOME.path} element={<Home />} />
					<Route path={ROUTES.ACTIVE.path} element={<ActivePage />} />
					<Route path={ROUTES.ACTIVE.withId(':id')} element={<ActiveDetailPage />} />
					<Route path={ROUTES.ABOUT.path} element={<AboutPage />} />
					<Route path={ROUTES.PROFILE.path} element={<Profile />} />
					<Route path={ROUTES.RANK.path} element={<RankPage />} />
					<Route path={ROUTES.EDIT_PROFILE.path} element={<EditProfilePage />} />
				</Route>
				<Route element={<AlignCenterLayout />}>
					<Route path={ROUTES.LOGIN.path} element={<Login />} />
					<Route path={ROUTES.REGISTER.path} element={<Register />} />
				</Route>
				<Route path='/manage' element={<MainLayout protectedLayout={true} requireRoles={[USER_ROLE.ADMIN, USER_ROLE.MODERATOR]} />}>
					<Route path='active' element={<ManageActivePage />} />
				</Route>
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</AuthContextProvider>
	);
};

export default App;
