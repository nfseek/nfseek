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
        
        const { page = 1, listPerPage = 10, searchTerm = '' } = req.body;
        const user = req.vsuser;

        if (!user?._id) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access'
            });
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(listPerPage);

        // Create search query
        const searchQuery = {
            userId: user._id,
            status: { $ne: 0 }  // Exclude deleted teams
        };

        if (searchTerm) {
            searchQuery.$or = [
                { teamName: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalTeams = await Team.countDocuments(searchQuery);

        // Get teams with populated contact details
        const teams = await Team.find(searchQuery)
            .populate({
                path: 'members.contactId',
                model: 'Contact',
                select: 'firstName lastName email'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(listPerPage));

        return res.status(200).json({
            status: 'success',
            message: 'Teams fetched successfully',
            data: teams || [],
            totalTeams: totalTeams || 0,
            currentPage: page,
            totalPages: Math.ceil(totalTeams / listPerPage)
        });

    } catch(err) {
        console.error('Get teams error:', err);
        return res.status(500).json({
            status: 'error',
            message: err.message || 'Server error',
            data: [],
            totalTeams: 0
        });
    }
};

export default authMiddleware(handler); 