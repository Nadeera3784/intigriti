import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { programs, programRelations } from '@/schemas/database/schema'
import { CreateProgramFormSchema } from '@/schemas/forms'
import { asc, desc, count } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url || '', 'http://localhost')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const validSortFields = ['name', 'startDate', 'eligibility', 'createdAt']
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: `Invalid sortBy field. Must be one of: ${validSortFields.join(', ')}` },
        { status: 400 }
      )
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      return NextResponse.json(
        { error: 'Invalid sortOrder. Must be "asc" or "desc"' },
        { status: 400 }
      )
    }

    if (page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      )
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    let orderBy
    switch (sortBy) {
      case 'name':
        orderBy = sortOrder === 'asc' ? asc(programs.name) : desc(programs.name)
        break
      case 'startDate':
        orderBy = sortOrder === 'asc' ? asc(programs.startDate) : desc(programs.startDate)
        break
      case 'eligibility':
        orderBy = sortOrder === 'asc' ? asc(programs.eligibility) : desc(programs.eligibility)
        break
      case 'createdAt':
      default:
        orderBy = sortOrder === 'asc' ? asc(programs.createdAt) : desc(programs.createdAt)
        break
    }

    const [totalCountResult] = await db
      .select({ count: count() })
      .from(programs)

    const totalCount = totalCountResult.count
    const totalPages = Math.ceil(totalCount / limit)
    const offset = (page - 1) * limit
    
    const paginatedPrograms = await db
      .select()
      .from(programs)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({ 
      programs: paginatedPrograms,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const bodyWithDate = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined
    }

    const validationResult = CreateProgramFormSchema.safeParse(bodyWithDate)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const { name, startDate, website, twitter, type, identifier, description, relatedPrograms } = validationResult.data

    const [newProgram] = await db
      .insert(programs)
      .values({
        name,
        startDate,
        website: website || null,
        twitter: twitter || null,
        type,
        identifier,
        description: description || null,
      })
      .returning()

    if (relatedPrograms && relatedPrograms.length > 0) {
      const relationValues = relatedPrograms.map(relatedProgramId => ({
        parentProgramId: newProgram.id,
        relatedProgramId: relatedProgramId,
      }))
      
      await db.insert(programRelations).values(relationValues)
    }

    return NextResponse.json({ program: newProgram }, { status: 201 })
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    )
  }
}
