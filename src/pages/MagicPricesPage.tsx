import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaSearch } from "react-icons/fa";

import MagicCard from "@/components/MagicCard";

export default function MagicPricesPage() {
	const [magicCardBase, SetMagicCardBase] = useState<{
		setCode: string;
		cardNumber: string;
	} | null>(null);

	const onFormSubmit = (formData: FormData) => {
		const search = (formData.get("search") as string).trim();

		if (!search || search.length < 4) {
			console.error("Invalid search");
			return;
		}

		const setCode = search.substring(0, 3);
		const cardNumber = search.substring(3).trim();

		SetMagicCardBase({ setCode, cardNumber });
	};

	return (
		<div className="max-w-screen-xl mx-auto">
			<Helmet>
				<title>Magic Prices - Sy_nc</title>
			</Helmet>
			<form action={onFormSubmit} className="p-3">
				<div className="w-full flex flex-row gap-2 rounded-xl bg-neutral-600">
					<input
						autoComplete="off"
						className="py-3 px-6 text-xl placeholder-neutral-400 focus:outline-none text-white flex-grow"
						name="search"
						placeholder="Search"
					/>
					<button
						aria-label="Search"
						className="w-12 flex flex-col items-center justify-center rounded-full text-xl cursor-pointer"
						type="submit"
					>
						<FaSearch />
					</button>
				</div>
			</form>
			<MagicCard magicCardBase={magicCardBase} />
		</div>
	);
}
