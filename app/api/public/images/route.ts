import { listImages } from "@/db/queries/images"
import { NextRequest, NextResponse } from "next/server"



const GET = async (req: NextRequest) => {
    const page = req.nextUrl.searchParams.get("page")
    const imagesList = await listImages({page:Number(page)||1})
    return NextResponse.json(imagesList, {status: 200})
}

export { GET }