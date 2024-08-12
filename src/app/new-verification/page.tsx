"use client";
import React, { useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
export default function NewVerificationTokenPage() {
	const searchParams = useSearchParams();

	const token = searchParams.get("token");
	// console.log("token", token);

	const onSubmit = useCallback(
		(token) => {
			if (!token) {
				return;
			}

			newVerification(token)
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		[token]
	);

	useEffect(() => {
		onSubmit(token);
	}, [token]);
	return (
		<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
			<div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
				<div className="flex items-center justify-between">
					<Link href="#" prefetch={false}>
						<MountainIcon className="h-6 w-6" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					<div className="flex items-center gap-2">
						<Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
							Facebook
						</Link>
						<Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
							Twitter
						</Link>
						<Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
							Instagram
						</Link>
					</div>
				</div>
				<div className="mt-8 space-y-4">
					<div className="flex flex-col items-center justify-center">
						<CircleCheckIcon className="h-12 w-12 text-green-500" />
						<h2 className="mt-4 text-2xl font-bold">Account Created!</h2>
						<p className="mt-2 text-muted-foreground">
							Congratulations, your account has been successfully created.
						</p>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Email:</span>
							<span className="text-sm">example@acme.com</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Password:</span>
							<span className="text-sm">********</span>
						</div>
					</div>
				</div>
				<div className="mt-8 border-t pt-4 text-xs text-muted-foreground">
					<p>
						If you have any questions or need assistance, please don't hesitate to contact us at{" "}
						<Link href="#" className="font-medium hover:underline" prefetch={false}>
							support@acme.com
						</Link>
						.
					</p>
					<p className="mt-2">&copy; 2024 Acme Inc. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}

function CircleCheckIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	);
}

function MountainIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m8 3 4 8 5-5 5 15H2L8 3z" />
		</svg>
	);
}
