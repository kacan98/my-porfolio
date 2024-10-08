import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

const MotivationalLetterParams = z.object({
  candidate: z.object({}),
  jobDescription: z.string(),
  strongPoints: z.array(z.string()),
})

type ZodMotivationalLetterParams = {
  candidate: CVSettings
  jobDescription: string
  strongPoints: string[]
}

export interface MotivationalLetterParams extends ZodMotivationalLetterParams {
  candidate: CVSettings
}

export type MotivationalLetterResponse = {
  letter: Array<{
    type: 'title' | 'paragraph' | 'list'
    content: string | string[]
  }>
}

const MotivationalLetterSchema = z.array(
  z.object({
    type: z.enum(['title', 'paragraph', 'list']),
    content: z.union([
      z.string(), // for title and paragraph
      z.array(z.string()), // for list items
    ]),
  })
)

export async function POST(req: Request): Promise<Response> {
  try {
    const body: MotivationalLetterParams = await req.json()

    MotivationalLetterParams.parse(body)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a charming, confident, and persuasive candidate for this position:`,
        },
        {
          role: 'user',
          content: body.jobDescription,
        },
        {
          role: 'user',
          content: 'And here is about you:',
        },
        {
          role: 'user',
          content: JSON.stringify(body.candidate),
        },
        {
          role: 'user',
          content: `Write a motivational letter highlighting your strong points and how you would fit the position.
          Make it personal, unique, tailored to the position, and easy to read and understand.
          
          Be brief and to the point. Charming and friendly. No bullshit. No fluff.
          `,
        },
      ],
      response_format: zodResponseFormat(
        MotivationalLetterSchema,
        'transformed_letter'
      ),
    })

    return new Response(JSON.stringify(response.choices[0].message.content), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
