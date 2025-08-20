import type { ReactNode } from "react";

interface TitleProps {
	msg: string;
	children?: ReactNode;
}

export default function Title({ msg, children }: TitleProps) {
	return (
		<header className="mt-3 flex max-h-20 gap-2 rounded-2xl bg-white px-5 py-3 font-bold">
			{children}
			<span>{msg}</span>
		</header>
	);
}
