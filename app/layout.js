import Header from '@/app/_components/Header';

import { Josefin_Sans } from 'next/font/google';

const josefin = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

import '@/app/_styles/globals.css';

export const metadata = {
	// title: 'The Wild Oasis',
	title: {
		template: '%s / The Wild Oasis',
		default: 'Welcome / The Wild Oasis',
	},
	description:
		'Luxurios cabin hotel, located in the Goa, surrounded by beautiful occean',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${josefin.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col`}
			>
				<Header />
				<div className='flex-1 px-8 py-12 grid'>
					<main className='max-w-7xl mx-auto w-full'>{children}</main>
				</div>
			</body>
		</html>
	);
}
