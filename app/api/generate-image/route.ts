import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: NextRequest) {
  try {
    const userToken = request.headers.get('x-replicate-api-token');
    if (!userToken) {
      return NextResponse.json(
        { error: 'Missing Replicate API token. Please provide it in the X-Replicate-Api-Token header.' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({ auth: userToken });
    const model = 'google/nano-banana';

    const { prompt, input_image } = await request.json();

    const input = {
      prompt,
      image_input: [input_image],
      output_format: "jpg"
    };

    const output = await replicate.run(model, { input }) as string[];
    const replicateImageUrl = output[0];

    return NextResponse.json({ imageUrl: replicateImageUrl });
  } catch (error: any) {
    console.error('Error in generate-image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Replicate-Api-Token',
    },
  });
}