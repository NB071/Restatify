"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";

import {
	Authenticator,
	Heading,
	Radio,
	RadioGroupField,
	useAuthenticator,
	View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { usePathname, useRouter } from "next/navigation";

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_UPOOL_ID!,
			userPoolClientId:
				process.env.NEXT_PUBLIC_AWS_COGNITO_UPOOL_CLIENT_ID!,
		},
	},
});

const formFields = {
	signIn: {
		username: {
			Placeholder: "Enter your email",
			label: "Email",
			isRequired: true,
		},
		password: {
			Placeholder: "Enter your password",
			label: "Password",
			isRequired: true,
		},
	},
	signUp: {
		username: {
			order: 1,
			Placeholder: "Choose a username",
			label: "Username",
			isRequired: true,
		},
		email: {
			order: 2,
			Placeholder: "Enter your email address",
			label: "Email",
			isRequired: true,
		},
		password: {
			order: 3,
			Placeholder: "Enter your password",
			label: "Password",
			isRequired: true,
		},
		confirm_password: {
			order: 4,
			Placeholder: "Confirm your password",
			label: "Confirm Password",
			isRequired: true,
		},
	},
};

const components = {
	Header() {
		return (
			<View className="mt-4 mb-7">
				<Heading level={3} className="!text-2xl !font-bold">
					R
					<span className="text-secondary-500 font-light hover:!text-primary-300 duration-300">
						estatify
					</span>
				</Heading>
				<p className="text-muted-foreground mt-2">
					<span className="font-bold">Welcome!</span> Please sign in
					to continue
				</p>
			</View>
		);
	},
	SignIn: {
		Footer() {
			const { toSignUp } = useAuthenticator();
			return (
				<View className="text-center mt-4">
					<p className="text-muted-foreground">
						Don&apos;t have an account?{" "}
						<button
							onClick={toSignUp}
							className="text-primary hover:underline bg-transparent border-none p-0"
						>
							{" "}
							Sign up here
						</button>
					</p>
				</View>
			);
		},
	},

	SignUp: {
		FormFields() {
			const { validationErrors } = useAuthenticator();

			return (
				<>
					<Authenticator.SignUp.FormFields />
					<RadioGroupField
						legend="Role"
						name="custom:role"
						errorMessage={validationErrors?.["custom:role"]}
						hasError={!!validationErrors?.["custom:role"]}
						isRequired
					>
						<Radio value="tenant">Tenant</Radio>
						<Radio value="manager">Manager</Radio>
					</RadioGroupField>
				</>
			);
		},
		Footer() {
			const { toSignIn } = useAuthenticator();
			return (
				<View className="text-center mt-4">
					<p className="text-muted-foreground">
						Already have an account?{" "}
						<button
							onClick={toSignIn}
							className="text-primary hover:underline bg-transparent border-none p-0"
						>
							{" "}
							Sign in
						</button>
					</p>
				</View>
			);
		},
	},
};

const Auth = ({ children }: { children: React.ReactNode }) => {
	const { user } = useAuthenticator((context) => [context.user]);
	const router = useRouter();
	const pathname = usePathname();

	const isAuthPage = pathname.match(/^\/(signin|signup)$/);
	const isDashboardPage =
		pathname.startsWith("/manager") || pathname.startsWith("/tenant");

	// Redirect to dashboard if user is authenticated and on auth page
	useEffect(() => {
		if (user && isAuthPage) {
			router.push("/");
		}
	}, [user, isAuthPage, router]);

	// Allow access to public pages
	if (!isAuthPage && !isDashboardPage) {
		return <>{children}</>;
	}

	return (
		<Authenticator
			initialState={pathname.includes("signup") ? "signUp" : "signIn"}
			components={components}
			formFields={formFields}
			className="h-full"
		>
			{() => <>{children}</>}
		</Authenticator>
	);
};

export default Auth;
