import mongoose from 'mongoose';

const ProvinceSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

ProvinceSchema.index({ _id: 1 });
ProvinceSchema.index({ code: 1 });
ProvinceSchema.index({ name: 1 });

const ProvinceModel = mongoose.models.Province || mongoose.model('Province', ProvinceSchema);
export default ProvinceModel;
