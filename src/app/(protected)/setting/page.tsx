import React from "react";
import { auth } from "@/lib/auth";
export default async function Setting() {
	const session = await auth();
	return <div>Setting {JSON.stringify(session)}</div>;
}
