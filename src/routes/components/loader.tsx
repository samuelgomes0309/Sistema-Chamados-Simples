export default function RouteLoader() {
	return (
		<main className="flex min-h-screen w-full items-center justify-center bg-zinc-800">
			<div className="mx-auto my-auto flex flex-col items-center justify-center text-center">
				<div className="size-12 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-700" />
				<h2 className="mt-3.5 animate-pulse text-2xl font-semibold text-white">
					Carregando ...
				</h2>
			</div>
		</main>
	);
}
