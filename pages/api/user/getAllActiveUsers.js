import dbConnect from '../../../lib/dbConnect';
import Users from '../../../models/User';

export default async function handler(req, res) {
    await dbConnect(); // Connect to the database

    try {
        // Fetch all active users with required fields
        const users = await Users.find({
            status: { $ne: 0 },  // Get all active users
            qrId: { $exists: true, $ne: null } 
        }).select('name firstName lastName email qrId createdAt profilePicture qrImage');

        if (!users || users.length === 0) {
            return res.status(200).json({ status: 'success', data: [] });
        }

        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
} 