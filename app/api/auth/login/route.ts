import User from "@/database/user.model";
import { connectDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectDatabase();
        const { email, password } = await req.json();
        const isExistUser = await User.findOne({ email });
        if (!isExistUser) {
            return NextResponse.json(
                { error: "Email does not exist" },
                { status: 400 }
            );
        }
        const isPasswordMatch = await compare(password, isExistUser.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                { error: "Password is incorrect" },
                { status: 400 }
            );
        }
        return NextResponse.json({ success: true, user: isExistUser });
    } catch (error) {
        const result = error as Error;
        return NextResponse.json({ error: result.message }, { status: 400 });
    }
}