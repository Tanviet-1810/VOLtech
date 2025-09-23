export const ROUTES = {
	HOME: {
		path: '/home',
		name: 'Home',
		description: 'Trang chủ',
	},
	LOGIN: {
		path: '/login',
		name: 'Login',
		description: 'Trang đăng nhập người dùng',
	},
	REGISTER: {
		path: '/register',
		name: 'Register',
		description: 'Trang đăng ký người dùng',
	},
	PROFILE: {
		path: '/profile',
		name: 'Profile',
		description: 'Trang hồ sơ người dùng',
	},
	EDIT_PROFILE: {
		path: '/profile/edit',
		name: 'Edit Profile',
		description: 'Trang chỉnh sửa hồ sơ người dùng',
	},
	RANK: {
		path: '/rank',
		name: 'Rank',
		description: 'Bảng xếp hạng người dùng',
	},
	CONTACT: {
		path: '/contact',
		name: 'Contact',
		description: 'Trang liên hệ',
	},
	ABOUT: {
		path: '/about',
		name: 'About',
		description: 'Trang giới thiệu về chúng tôi',
	},
	ACTIVE: {
		path: '/active',
		name: 'Active',
		description: 'Trang các mục đang hoạt động',
		withId: (id) => `/active/${id}`,
	},
	ACTIVE_MANAGE: {
		path: '/manage/active',
		name: 'Active Manage',
		description: 'Trang quản lý các mục đang hoạt động',
	},
	HELP: {
		path: '/help',
		name: 'Help',
		description: 'Trang trợ giúp',
	},
	TERMS: {
		path: '/terms',
		name: 'Terms',
		description: 'Trang điều khoản sử dụng',
	},
};
