import User from "@/database/user.model";
import { connectDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectDatabase();
        const { username, email, password, profileImage } = await req.json();
        console.log(profileImage)
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All Gaps must be filled" },
                { status: 400 },
            );
        }
        const isExistUser = await User.findOne({ email });
        if (isExistUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }
        const hashedPassword = await hash(password, 10);
        const isProfileExiste = profileImage ? profileImage : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg"
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            profileImage: isProfileExiste
        });
        return NextResponse.json({ success: true, user });
    } catch (error) {
        const result = error as Error;
        return NextResponse.json({ error: result.message }, { status: 400 });
    }
}