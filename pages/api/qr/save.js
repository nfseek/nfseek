import { authMiddleware } from '../../../lib/authMiddleware';
import { QRCode } from '../../../models/DB';
import Common from '../../../helpers/Common';

const routeHandler = {};

routeHandler.saveQR = async (req, res) => {
    const postdata = req.body;
    const user = req.vsuser;
    
    try {
        const validateFields = ["imageUrl", "qrId", "qrUrl"];
        const response = await Common.requestFieldsValidation(validateFields, postdata);
        
        if (response.status) {
            const newQR = new QRCode({
                userId: user._id,
                imageUrl: postdata.imageUrl,
                qrId: postdata.qrId,
                qrUrl: postdata.qrUrl,
                name: postdata.name || 'Untitled QR',
                status: 1
            });

            await newQR.save();
            
            return res.json({
                status: 'success',
                message: 'QR code saved successfully',
                data: newQR
            });
        }
        
        return res.json({
            status: 'error',
            message: 'Required fields are missing'
        });
    } catch (err) {
        console.error('Error in saveQR:', err);
        return res.json({
            status: 'error',
            message: err.message || 'Server error'
        });
    }
};

const handler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            await routeHandler.saveQR(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default authMiddleware(handler);
