import mongoose from 'mongoose';
import { ACTIVE_STATUS } from '../enums/active.js';
import CommuneModel from './commune.model.js';
import UserModel from './user.model.js';

const ActiveSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		points: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: Object.values(ACTIVE_STATUS),
			default: ACTIVE_STATUS.CLOSED,
		},
		commune: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Commune',
			required: true,
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		maxParticipants: {
			type: Number,
			min: 1,
			required: true,
		},
		registeredUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		images: [
			{
				type: String,
				trim: true,
			},
		],
		notes: {
			type: String,
			trim: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

const ActiveModel = mongoose.models.Active || mongoose.model('Active', ActiveSchema);
export default ActiveModel;
