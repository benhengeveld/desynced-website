import React from "react";
import { Helmet } from "react-helmet-async";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

import MagicCard from "@/components/MagicCard";

export default function MagicPricesPage() {
	const navigate = useNavigate();

	const { setCode, cardNumber } = useParams();
	const magicCardBase =
		setCode && cardNumber ? { setCode, cardNumber } : null;

	const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const search = (formData.get("searchInput") as string).trim();

		if (!search || search.length < 4) {
			console.error("Invalid search");
			return;
		}

		const setCode = search.substring(0, 3);
		const cardNumber = search.substring(3).trim();

		void navigate(`/magic-prices/${setCode}/${cardNumber}`);
	};

	return (
		<div className="max-w-screen-xl mx-auto">
			<Helmet>
				<title>Magic Prices - Sy_nc</title>
			</Helmet>
			<form className="p-3" onSubmit={onFormSubmit}>
				<div className="w-full flex flex-row gap-2 rounded-xl bg-neutral-600">
					<input
						autoComplete="off"
						className="py-3 px-6 text-xl placeholder-neutral-400 focus:outline-none text-white flex-grow"
						name="searchInput"
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
