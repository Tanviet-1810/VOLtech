export const USER_ROLE = {
	ADMIN: 'admin',
	MODERATOR: 'moderator',
	USER: 'user',
};

export const USER_ROLE_VIETNAMESE = {
	admin: 'Quản trị',
	moderator: 'Người tổ chức',
	user: 'Tình nguyện viên',
};

export const USER_ROLE_VALUE_TO_KEY = {
	admin: 'ADMIN',
	moderator: 'MODERATOR',
	user: 'USER',
};

export const highestRole = (roles) => {
	const roleList = Array.isArray(roles) ? roles : [roles];
	if (roleList.includes(USER_ROLE.ADMIN)) return USER_ROLE.ADMIN;
	if (roleList.includes(USER_ROLE.MODERATOR)) return USER_ROLE.MODERATOR;
	return USER_ROLE.USER;
};
