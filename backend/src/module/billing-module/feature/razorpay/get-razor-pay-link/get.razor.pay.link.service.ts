import { BadRequestException, Injectable } from "@nestjs/common";
import Razorpay from 'razorpay';
import { GetrazorPayLinkDto } from "./get.razor.pay.link.dto";

@Injectable()
export class GetRazorPayLinkService {
    constructor(
    ) { }

    async GetRazorPayLink(body: GetrazorPayLinkDto) {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const razorOrder = await razorpay.orders.create({
            amount: body.total_price * 100, // Amount in paise
            currency: "INR",
        });

        return {
            data: razorOrder
        };
    }
}