import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export async function POST(request: NextRequest) {
  try {
    const userToken = request.headers.get('x-fal-api-token');
    if (!userToken) {
      return NextResponse.json(
        { error: 'Missing FAL API token. Please provide it in the X-Fal-Api-Token header.' },
        { status: 400 }
      );
    }

    // Configure fal client with user token
    fal.config({
      credentials: userToken
    });

    const { prompt, input_image } = await request.json();

    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt,
        image_urls: [input_image],
        num_images: 1,
        output_format: "jpeg"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const imageUrl = result.data.images[0].url;

    return NextResponse.json({ 
      imageUrl,
      description: result.data.description 
    });
  } catch (error: any) {
    console.error('Error in generate-image-fal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Fal-Api-Token',
    },
  });
}