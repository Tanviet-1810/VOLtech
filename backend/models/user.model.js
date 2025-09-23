import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		passwordHashed: {
			type: String,
			required: true,
		},
		salt: {
			type: Buffer,
			required: true,
		},
		birthDate: {
			type: Date,
			required: true,
		},
		unit: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		score: {
			type: Number,
			default: 0,
			min: 0,
		},
		avatar: {
			type: String,
			trim: true,
		},
		role: {
			type: [String],
			default: ['user'],
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;
