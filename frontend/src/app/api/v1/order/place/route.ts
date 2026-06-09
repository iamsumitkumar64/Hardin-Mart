import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    try {
        const BACKEND_URL = 'http://backend:8090';
        const token = String(request.headers.get("Authorization") || request.headers.get("authorization"));

        if (!token) {
            return NextResponse.json(
                { error: "No Authorization token provided" },
                { status: 401 }
            );
        }

        // 1. Read and parse the stream body correctly
        const reqBody = await request.json();

        const result = await fetch(`${BACKEND_URL}/api/v1/sale/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(reqBody),
        });

        const response = await result.json();
        if (!result.ok) {
            throw new Error(`Sale order creation failed: ${JSON.stringify(result)}`);
        }

        // 2. Safely reference reqBody instead of undefined `body`
        const payload = {
            order_id: response.data.id,
            order_uuid: response.data.uuid,
            customer_uuid: response.data.customer_uuid,
            total_price: response.data.total_price,
            address_uuid: reqBody.address_uuid,
            items: response.data.items.map((item: any) => ({
                uuid: item.uuid,
                id: item.id,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                created_at: item.created_at,
            })),
            created_at: response.data.created_at,
        }

        // 3. Complete the Promise.all array for concurrent billing/other requests
        const [api1Res, api2Res] = await Promise.allSettled([
            fetch(`${BACKEND_URL}/api/v1/billing/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            }),
            fetch(`${BACKEND_URL}/api/v1/shipment/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })
        ]);

        return NextResponse.json({ message: "Order Placed Success", data: result }, { status: 200 });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}