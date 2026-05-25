import { NextResponse } from "next/server";

import type { ApiErrorPayload } from "@/types/api";

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(error: ApiErrorPayload, status = 400) {
  return NextResponse.json({ error }, { status });
}
