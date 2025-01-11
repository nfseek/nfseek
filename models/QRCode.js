import mongoose, { Schema, model } from "mongoose";

const qrCodeSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        imageUrl: { type: String, required: true },
        qrId: { type: String, required: true },
        qrUrl: { type: String, required: true },
        name: { type: String, default: 'Untitled QR' },
        status: { type: Number, default: 1 }, // 1: active, 0: inactive
    },
    {
        timestamps: true,
    }
);

qrCodeSchema.index({ name: "text", qrUrl: "text" });
const QRCodeModel = mongoose.models.QRCode || model('QRCode', qrCodeSchema);
export default QRCodeModel;
