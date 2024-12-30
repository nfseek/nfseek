import { authMiddleware } from '../../../lib/authMiddleware';
import Team from '../../../models/Team';
import dbConnect from '../../../lib/dbConnect';
import mongoose from 'mongoose';

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            status: 'error',
            message: `Method ${req.method} Not Allowed`
        });
    }

    try {
        await dbConnect();
        
        const { teamId } = req.body;
        const user = req.vsuser;

        if (!user?._id) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access'
            });
        }

        const team = await Team.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(teamId),
                    userId: user._id,
                    status: { $ne: 0 }
                }
            },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'members.contactId',
                    foreignField: '_id',
                    as: 'contactDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { contacts: '$contactDetails' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$email', '$$contacts.email']
                                }
                            }
                        }
                    ],
                    as: 'userDetails'
                }
            },
            {
                $addFields: {
                    members: {
                        $map: {
                            input: '$members',
                            as: 'member',
                            in: {
                                $let: {
                                    vars: {
                                        contactInfo: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: '$contactDetails',
                                                        cond: { $eq: ['$$this._id', '$$member.contactId'] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    },
                                    in: {
                                        $mergeObjects: [
                                            '$$member',
                                            {
                                                contactId: {
                                                    $mergeObjects: [
                                                        '$$contactInfo',
                                                        {
                                                            isUser: {
                                                                $gt: [
                                                                    {
                                                                        $size: {
                                                                            $filter: {
                                                                                input: '$userDetails',
                                                                                cond: {
                                                                                    $eq: ['$$this.email', '$$contactInfo.email']
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    0
                                                                ]
                                                            },
                                                            qrDetails: {
                                                                $let: {
                                                                    vars: {
                                                                        userInfo: {
                                                                            $arrayElemAt: [
                                                                                {
                                                                                    $filter: {
                                                                                        input: '$userDetails',
                                                                                        cond: {
                                                                                            $eq: ['$$this.email', '$$contactInfo.email']
                                                                                        }
                                                                                    }
                                                                                },
                                                                                0
                                                                            ]
                                                                        }
                                                                    },
                                                                    in: {
                                                                        qrId: '$$userInfo.qrId',
                                                                        qrImage: '$$userInfo.qrImage',
                                                                        qrUrl: '$$userInfo.qrUrl'
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    teamName: 1,
                    description: 1,
                    members: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!team || team.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Team not found'
            });
        }

        // Sort members based on monthly scans
        team[0].members.sort((a, b) => {
            const aScans = a.contactId?.qrDetails?.qrId ? a.contactId.qrDetails.month || 0 : 0;
            const bScans = b.contactId?.qrDetails?.qrId ? b.contactId.qrDetails.month || 0 : 0;
            return bScans - aScans; // Sort in descending order
        });

        return res.status(200).json({
            status: 'success',
            message: 'Team details fetched successfully',
            data: team[0]
        });

    } catch(err) {
        console.error('Get team details error:', err);
        return res.status(500).json({
            status: 'error',
            message: err.message || 'Server error'
        });
    }
};

export default authMiddleware(handler);