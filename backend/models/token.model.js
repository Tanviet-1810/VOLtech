import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
		},
		token: {
			type: String,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		id: false,
	}
);

TokenSchema.index({ _id: 1 }, { unique: true });
TokenSchema.index({ _id: 1, blacklisted: 1 });
const TokenModel = mongoose.models.Token || mongoose.model('Token', TokenSchema);
export default TokenModel;
