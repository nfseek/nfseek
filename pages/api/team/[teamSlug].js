import { authMiddleware } from '../../../lib/authMiddleware';
import { Team, Contact } from '../../../models/DB';
import Common from '../../../helpers/Common';
import CommonAPI from '../../../helpers/CommonAPI';

const routeHandler = {}

routeHandler.getTeams = async (req, res) => {
    let postdata = req.body;
    let user = req.vsuser;
    try {
        const page = parseInt(postdata.page) || 1;
        const limit = parseInt(postdata.listPerPage) || 10;
        const skip = (page - 1) * limit;

        let query = { userId: user._id };
        if (postdata.searchTerm) {
            query.teamName = { $regex: postdata.searchTerm, $options: 'i' };
        }

        const teams = await Team.find(query)
            .skip(skip)
            .limit(limit)
            .populate('members.contactId', 'firstName lastName email phoneNumber')
            .sort({ createdAt: -1 });

        const totalTeams = await Team.countDocuments(query);

        res.json({
            status: 'success',
            data: teams,
            totalTeams: totalTeams
        });
    } catch(err) {
        res.json({
            status: 'error',
            message: 'Server error'
        });
    }
};

routeHandler.addTeam = async (req, res) => {
    let postdata = req.body;
    let user = req.vsuser;
    try {
        let validateFields = ["teamName", "members"];
        let response = await Common.requestFieldsValidation(validateFields, postdata);
        
        if(response.status) {
            const teamData = {
                userId: user._id,
                teamName: postdata.teamName,
                description: postdata.description || '',
                members: postdata.members.map(memberId => ({
                    contactId: memberId,
                    role: 'member'
                }))
            };

            await Team.create(teamData);
            res.json({
                status: 'success',
                message: 'Team created successfully'
            });
        } else {
            res.json({
                status: 'error',
                message: 'Required fields are missing'
            });
        }
    } catch(err) {
        res.json({
            status: 'error',
            message: 'Server error'
        });
    }
};

routeHandler.updateTeam = async (req, res) => {
    let postdata = req.body;
    let user = req.vsuser;
    try {
        let validateFields = ["teamId", "teamName", "members"];
        let response = await Common.requestFieldsValidation(validateFields, postdata);
        
        if(response.status) {
            let where = {
                _id: postdata.teamId,
                userId: user._id
            };

            let set = {
                teamName: postdata.teamName,
                description: postdata.description || '',
                members: postdata.members.map(memberId => ({
                    contactId: memberId,
                    role: 'member'
                })),
                updatedAt: new Date()
            };

            await Team.updateOne(where, { $set: set });
            res.json({
                status: 'success',
                message: 'Team updated successfully'
            });
        } else {
            res.json({
                status: 'error',
                message: 'Required fields are missing'
            });
        }
    } catch(err) {
        res.json({
            status: 'error',
            message: 'Server error'
        });
    }
};

routeHandler.deleteTeam = async (req, res) => {
    let postdata = req.body;
    let user = req.vsuser;
    try {
        await Team.deleteOne({
            _id: postdata.teamId,
            userId: user._id
        });
        res.json({
            status: 'success',
            message: 'Team deleted successfully'
        });
    } catch(err) {
        res.json({
            status: 'error',
            message: 'Server error'
        });
    }
};

routeHandler.getTeamDetails = async (req, res) => {
    let postdata = req.body;
    let user = req.vsuser;
    try {
        if (!postdata.teamId) {
            return res.json({
                status: 'error',
                message: 'Team ID is required'
            });
        }

        const team = await Team.findOne({
            _id: postdata.teamId,
            userId: user._id
        }).populate({
            path: 'members.contactId',
            select: 'firstName lastName email phoneNumber company isUser userId',
            populate: {
                path: 'userId',
                select: 'qrId qrImage qrUrl',
                model: 'User'
            }
        });

        if (!team) {
            return res.json({
                status: 'error',
                message: 'Team not found'
            });
        }

        // Transform the response to include user details
        const transformedTeam = {
            ...team.toObject(),
            members: team.members.map(member => ({
                ...member,
                contactId: {
                    ...member.contactId,
                    qrDetails: member.contactId.userId ? {
                        qrId: member.contactId.userId.qrId,
                        qrImage: member.contactId.userId.qrImage,
                        qrUrl: member.contactId.userId.qrUrl
                    } : null
                }
            }))
        };

        res.json({
            status: 'success',
            data: transformedTeam
        });
    } catch(err) {
        console.error('Team details error:', err);
        res.json({
            status: 'error',
            message: err.message || 'Server error'
        });
    }
};

export default authMiddleware(async (req, res) => {
    const { teamSlug } = req.query;
    if (typeof routeHandler[teamSlug] !== "function") {
        return res.status(400).json({ status: 'error', message: 'Invalid request' });
    }
    return routeHandler[teamSlug](req, res);
});