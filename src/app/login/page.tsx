"use client";
import React, { useTransition } from "react";
import Image from "next/image";
import { Logo, MailIcon, EyeFilledIcon, EyeSlashFilledIcon, GithubIcon, GoogleIcon } from "@/components/icons";
import { FormEvent } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import clsx from "clsx";
import { login } from "@/actions/login";
import Link from "next/link";
import { loginSchema } from "@/validator";

const initialValues = {
	email: "",
	otp: ["", "", "", ""],
	password: "",
	isNotOtpLogin: true,
};
export default function Login() {
	const [isPending, startTransition] = useTransition();
	const formik = useFormik({
		initialValues,
		validationSchema: loginSchema,
		onSubmit: async (values, { setStatus, setSubmitting, setFieldError }) => {
			// console.log(values);
			startTransition(() => {
				login({ email: values.email, password: values.password }, "")
					.then((data) => {
						console.log("data", data);
					})
					.catch((error) => {
						console.log("error", error);
					});
				// .catch(() => setError("Something went wrong"))
			});
		},
	});
	return (
		<div className="flex h-screen">
			{/* <!-- left Pane --> */}

			<div className="w-full bg-gray-100 lg:w-1/2 ">
				<h1 className="text-2xl font-semibold my-4 text-black ">
					<div className="flex justify-start items-center gap-1">
						<Logo />
						<p className="font-bold text-inherit">AssessMe360</p>
					</div>
				</h1>
				<div className=" flex items-center justify-center h-[calc(100vh-58px)]">
					<div className="max-w-lg w-full p-6">
						<h1 className="text-3xl font-semibold mb-2 text-black ">Hey , Welcome back</h1>
						<h1 className="text-sm font-semibold mb-6 text-gray-500 ">Good to see You Again</h1>

						<form autoComplete="off" onSubmit={formik.handleSubmit}>
							<div className="flex w-full flex-wrap  mb-6 md:mb-0 gap-4">
								<div className="w-full">
									<Label className="text-base font-normal ">Email Address</Label>
									<Input
										type="email"
										placeholder="you@example.com"
										name="email"
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={clsx(
											"mt-2 bg-white py-5 px-3 text-base font-light",
											{
												"border-red-500": formik.touched.email && formik.errors.email,
											},
											{
												valid: formik.touched.email && !formik.errors.email,
											}
										)}
									/>
									{formik.touched.email && formik.errors.email && (
										<p className="absolute text-red-500 mt-1 text-xs">{formik.errors.email}</p>
									)}
								</div>
								<div className="w-full mt-3">
									<Label className="text-base font-normal">Password</Label>
									<Input
										placeholder="Enter your password"
										name="password"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={clsx(
											"mt-2 bg-white py-5 px-3 text-base font-light",
											{
												"border-red-500": formik.touched.password && formik.errors.password,
											},
											{
												valid: formik.touched.password && !formik.errors.password,
											}
										)}
									/>
									{formik.touched.password && formik.errors.password && (
										<p className="absolute text-red-500 mt-1 text-xs">{formik.errors.password}</p>
									)}
								</div>

								{/* {errors.email?.message && <p>{errors.email?.message}</p>} */}

								<div className="flex justify-between items-center w-full">
									{/* <Link
										color="foreground"
										onPress={async () => {
											const isValid = await trigger("email", { shouldFocus: true });
											if (isValid) {
												onOpen();
											}
										}}
										underline="always"
										className="cursor-pointer"
									>
										Login with OTP
									</Link> */}
									{/* <Link
										color="foreground"
										onPress={onOpen}
										underline="always"
										className="cursor-pointer"
									>
										Forgot password ?
									</Link> */}
								</div>
								<Button color="primary" type="submit" className="w-full mb-4 bg-black">
									Log In
								</Button>
							</div>
						</form>
						<div className="relative mt-4 w-ful">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t-2"></span>
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-gray-100 px-2 text-muted-foreground">Or continue with</span>
							</div>
						</div>
						<div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
							<div className="w-full lg:w-1/2 mb-2 lg:mb-0">
								<button
									type="button"
									// onClick={() => signIn("google", { callbackUrl: "/" })}
									className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
								>
									<GoogleIcon />
									Sign Up with Google{" "}
								</button>
							</div>
							<div className="w-full lg:w-1/2 ml-0 lg:ml-2">
								<button
									type="button"
									// onClick={() => signIn("github", { callbackUrl: "/" })}
									className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
								>
									<GithubIcon />
									Sign Up with Github{" "}
								</button>
							</div>
						</div>
						<div className="relative  w-full mt-4">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t-2"></span>
							</div>
						</div>
						<div className="text-base font-medium mt-12 text-center ">
							New to AssessMe360?{" "}
							<Link
								color="foreground"
								href="/signup"
								// onPress={presson}
								underline="always"
								className="cursor-pointer"
							>
								REGISTER NOW
							</Link>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- right Pane --> */}

			<div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
				<div className="max-w-lg text-center">
					<Image height={700} width={700} alt="sideicon" src="/sideicon.svg" />
				</div>
			</div>
			{/* <OtpModal isOpen={isOpen} onOpenChange={onOpenChange} /> */}
			{/* <ForgotPasswordModal isOpen={isOpen} onOpenChange={onOpenChange} /> */}
		</div>
	);
}
