import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: Request) {
  try {
    const { jewelryType, style, prompt } = await request.json();

    // Generate design description
    const designDescription = await generateDesignDescription(jewelryType, style, prompt);

    // Generate image
    const imageUrl = await generateImage(designDescription);

    // Generate promotional text
    const promotionalText = await generatePromotionalText(designDescription);

    return NextResponse.json({ designDescription, imageUrl, promotionalText });
  } catch (error) {
    console.error('Error in generate-design API route:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

async function generateDesignDescription(jewelryType: string, style: string, inspiration: string) {
  try {
    const prompt = `how would a lean ${style} gold ${jewelryType} design inspired by ${inspiration} look like, explain in a sentence as if you are describing the jewelry`;
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
    });
    return text;
  } catch (error) {
    console.error('Error generating design description:', error);
    throw new Error('Failed to generate design description');
  }
}

async function generatePromotionalText(designDescription: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Can you provide a short 2 sentence promotional text for this jewelry: ${designDescription}`,
    });
    return text;
  } catch (error) {
    console.error('Error generating promotional text:', error);
    throw new Error('Failed to generate promotional text');
  }
}

async function generateImage(designDescription: string) {
  try {
    const prompt = `Photo of ${designDescription} White background.`;
    const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from Replicate API:', errorData);
      throw new Error(`Image generation failed: ${errorData.detail || 'Unknown error'}`);
    }

    const result = await response.json();
    if (result.status === 'failed') {
      throw new Error('Image generation failed');
    }

    return result.output[0];
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

