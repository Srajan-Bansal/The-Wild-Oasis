/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ttpaoolcxryjssbkxknk.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/cabin-images/**',
			},
		],
	},
	// output: 'dist',
};

export default nextConfig;
