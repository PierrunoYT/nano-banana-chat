import Replicate from 'replicate';

export default async function handler(req, res) {
	// Enable CORS
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Replicate-Api-Token'
	);

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Require Replicate API token from header
		const userToken = req.headers['x-replicate-api-token'];
		if (!userToken) {
			return res.status(400).json({ error: 'Missing Replicate API token. Please provide it in the X-Replicate-Api-Token header.' });
		}

		const replicate = new Replicate({ auth: userToken });
		const model = 'google/nano-banana';

		const { prompt, input_image } = req.body;

		// Generate image with Replicate using nano-banana model
		const input = {
			prompt,
			image_input: [input_image], // nano-banana expects an array of images
			output_format: "jpg" // Set output format to jpg (default)
		};

		const output = await replicate.run(model, { input });

		const replicateImageUrl = output.url();

		// Return the Replicate URL directly (permanent URL from nano-banana)
		return res.status(200).json({ imageUrl: replicateImageUrl });
	} catch (error) {
		console.error('Error in generate-image:', error);
		return res.status(500).json({ error: error.message });
	}
}