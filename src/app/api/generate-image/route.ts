import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 })
    }

    console.log('Making request to Replicate API with token status:', process.env.REPLICATE_API_TOKEN ? 'Set' : 'Not set')

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
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error response from Replicate API:', errorData)
      return NextResponse.json({ message: 'Error from Replicate API', details: errorData }, { status: response.status })
    }

    const result = await response.json()
    console.log('Prediction result:', result)

    if (result.status === 'failed') {
      return NextResponse.json({ message: 'Image generation failed', details: result }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate-image API route:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

