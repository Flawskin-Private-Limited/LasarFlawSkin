import { useState } from "react";

const faqs = [
	{
		question: "Is it a safe method to treat all body areas?",
		answer:
			"All areas of the body like face, hands, legs, back, chest, abdomen, bikini and underarms can be safely treated. Laser hair reduction is effective when performed under the guidance of trained dermatology professionals.",
	},
	{
		question: "How many LHR sessions are needed to see results?",
		answer:
			"Most people notice visible reduction after 3 to 4 sessions, while a full plan usually needs 6 to 8 sessions depending on hair density, hormone profile and treatment area.",
	},
	{
		question: "How do I get started with the laser hair reduction treatment?",
		answer:
			"Start with a quick consultation and patch test. Based on your skin type and goals, we create a customized treatment plan and schedule sessions at your convenience.",
	},
];

export default function FAQSection() {
	const [openIndex, setOpenIndex] = useState(0);

	const toggleItem = (index) => {
		setOpenIndex((current) => (current === index ? -1 : index));
	};

	return (
		<section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
						Frequently Asked Questions
					</h2>
					<p className="text-gray-500 text-sm sm:text-base">
						Everything you need to know about laser hair reduction
					</p>
				</div>

				<div className="space-y-2.5 sm:space-y-3">
					{faqs.map((item, index) => {
						const isOpen = openIndex === index;

						return (
							<article
								key={item.question}
								className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300"
							>
								<button
									type="button"
									onClick={() => toggleItem(index)}
									aria-expanded={isOpen}
									className={`w-full text-left px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 transition-colors ${
										isOpen ? "bg-gray-50" : "bg-white hover:bg-gray-50"
									}`}
								>
									<span className="text-gray-900 text-sm sm:text-base font-semibold leading-snug">
										{item.question}
									</span>

									<span
										className={`shrink-0 text-gray-400 transition-transform duration-200 ${
											isOpen ? "rotate-180" : "rotate-0"
										}`}
										aria-hidden="true"
									>
										<svg
											viewBox="0 0 24 24"
											className="w-5 h-5"
											fill="none"
										>
											<path
												d="M6 15l6-6 6 6"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
								</button>

								{isOpen && (
									<div className="px-4 sm:px-6 pb-4 bg-gray-50 border-t border-gray-100">
										<p className="pt-3 text-gray-500 text-xs sm:text-sm leading-relaxed">
											{item.answer}
										</p>
									</div>
								)}
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
