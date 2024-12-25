import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
    try {
        await dbConnect();

        // Get all active users with required fields
        const users = await User.find({ 
            status: { $ne: 0 },  // Get all active users
            qrId: { $exists: true, $ne: null } 
        }).select('firstName lastName email qrId createdAt');

        if (!users) {
            return res.status(200).json([]);
        }

        // Map the users to include only necessary data
        const leaderboardData = users.map(user => ({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            qrId: user.qrId || '',
            createdAt: user.createdAt
        }));

        return res.status(200).json(leaderboardData);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error fetching leaderboard data'
        });
    }
}