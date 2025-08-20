import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	errors: boolean;
	errorStyles?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, errors, errorStyles, ...props }, ref) => {
		const styles =
			className ??
			"bg-white w-full max-w-96 mt-3 mb-1.5 h-10 px-3 rounded-sm outline-none border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-500";
		const errorStyle =
			errorStyles ??
			"bg-white w-full max-w-96 mt-3 mb-1.5 h-10 px-3 rounded-sm outline-none border border-transparent focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-500";
		return (
			<>
				<input ref={ref} className={errors ? errorStyle : styles} {...props} />
			</>
		);
	}
);

export default Input;
