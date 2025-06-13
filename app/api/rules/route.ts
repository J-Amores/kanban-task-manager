import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const rules = await database.getRules()
    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const ruleData = await request.json()
    const rule = await database.createRule(ruleData)
    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error creating rule:', error)
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    )
  }
}