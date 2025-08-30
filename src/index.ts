import { Hono } from 'hono';
import Replicate from 'replicate';

interface Env {
        REPLICATE_API_TOKEN: string;
}

const app = new Hono<{ Bindings: Env }>();


app.post('/generate-image', async (c) => {
        try {
                // Require Replicate API token from header
                const userToken = c.req.header('X-Replicate-Api-Token');
                if (!userToken) {
                        return c.json({ error: 'Missing Replicate API token. Please provide it in the X-Replicate-Api-Token header.' }, 400);
                }
                const replicate = new Replicate({ auth: userToken });
                const model = 'google/nano-banana';

                const { prompt, input_image } = await c.req.json();

                // Generate image with Replicate using nano-banana model
                const input = {
                        prompt,
                        image_input: [input_image], // nano-banana expects an array of images
                        output_format: "jpg" // Set output format to jpg (default)
                };

                const output = await replicate.run(model, { input });

                const replicateImageUrl = output.url();

                // Return the Replicate URL directly (permanent URL from nano-banana)
                return c.json({ imageUrl: replicateImageUrl });
        } catch (error) {
                console.error('Error in generate-image:', error);
                return c.json({ error: error.message }, 500);
        }
});

export default app;
