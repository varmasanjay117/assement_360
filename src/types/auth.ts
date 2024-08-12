export interface UserParams {
	email: string;
	password: string;
	name: string;
	phoneNo: string;
}

export interface User {
	id: string;
	name: string | null;
	email: string;
	phoneNo: string | null;
	password: string | null;
	emailVerified: Date | null;
	image: string | null;
}
