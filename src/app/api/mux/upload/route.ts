import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createUploadUrl } from "@/lib/mux";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uploadUrl, uploadId } = await createUploadUrl();
    return NextResponse.json({ uploadUrl, uploadId });
  } catch (err) {
    console.error("Mux upload URL creation failed:", err);
    return NextResponse.json(
      { error: "無法建立上傳連結，請確認 Mux API 金鑰是否正確設定" },
      { status: 500 },
    );
  }
}
