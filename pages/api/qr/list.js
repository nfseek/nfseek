import { authMiddleware } from '../../../lib/authMiddleware';
import { QRCode } from '../../../models/DB';

const routeHandler = {};

routeHandler.getQRCodes = async (req, res) => {
    const user = req.vsuser;
    
    try {
        const qrCodes = await QRCode.find({ 
            userId: user._id,
            status: 1
        }).sort({ createdAt: -1 });

        res.json({
            status: 'success',
            data: qrCodes
        });
    } catch (err) {
        console.error('Error in getQRCodes:', err);
        res.json({
            status: 'error',
            message: err.message || 'Server error'
        });
    }
};

const handler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            await routeHandler.getQRCodes(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default authMiddleware(handler);
