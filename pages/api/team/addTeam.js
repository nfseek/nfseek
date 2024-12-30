import { authMiddleware } from '../../../lib/authMiddleware';
import Team from '../../../models/Team';
import dbConnect from '../../../lib/dbConnect';

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            status: 'error',
            message: `Method ${req.method} Not Allowed`
        });
    }

    try {
        await dbConnect();
        
        const { teamName, description, members } = req.body;
        const user = req.vsuser;

        // Validate required fields
        if (!teamName || !members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Team name and at least one member are required'
            });
        }

        // Create new team
        const newTeam = new Team({
            userId: user._id,
            teamName,
            description: description || '',
            members: members.map(memberId => ({ contactId: memberId })),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newTeam.save();

        return res.status(200).json({
            status: 'success',
            message: 'Team created successfully',
            data: newTeam
        });

    } catch(err) {
        console.error('Add team error:', err);
        return res.status(500).json({
            status: 'error',
            message: err.message || 'Server error'
        });
    }
};

export default authMiddleware(handler);