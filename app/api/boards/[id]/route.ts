import { NextResponse } from "next/server"
import { z } from "zod"

import db from "@/lib/db"
import { logger } from "@/lib/utils/logger"

/**
 * Schema for validating route parameters
 * @property {string} params.id - The board ID from the URL
 */
const routeContextSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a valid number"),
  }),
})

/**
 * Schema for validating board update data
 * @property {string} name - The board name (required)
 * @property {string} description - Optional board description
 * @property {boolean} is_active - Board active status (defaults to true)
 */
const updateBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(100, "Board name cannot exceed 100 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  is_active: z.boolean().default(true),
})

/**
 * Updates a board by ID
 * @param req - The request object
 * @param context - The route context containing the board ID
 * @returns The updated board or error response
 */
export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params
    const { params } = routeContextSchema.parse(context)
    const boardId = parseInt(params.id, 10)

    // Parse and validate request body
    const json = await req.json()
    const body = updateBoardSchema.parse(json)

    logger.info(`Updating board ${boardId}`, { boardId, ...body })

    // Update the board
    const board = await db.board.update({
      where: { id: boardId },
      data: {
        name: body.name,
        description: body.description,
        is_active: body.is_active,
        updated_at: new Date(),
      },
    })

    logger.info(`Successfully updated board ${boardId}`)
    return NextResponse.json(board)
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Validation error updating board", { errors: error.issues })
      return NextResponse.json(
        { message: "Invalid request data", errors: error.issues },
        { status: 422 }
      )
    }

    logger.error("Error updating board", { error })
    return NextResponse.json(
      { message: "An error occurred while updating the board" },
      { status: 500 }
    )
  }
}

/**
 * Deletes a board by ID
 * @param req - The request object
 * @param context - The route context containing the board ID
 * @returns Success response or error
 */
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params
    const { params } = routeContextSchema.parse(context)
    const boardId = parseInt(params.id, 10)

    logger.info(`Deleting board ${boardId}`)

    // Delete the board
    await db.board.delete({
      where: { id: boardId },
    })

    logger.info(`Successfully deleted board ${boardId}`)
    return NextResponse.json({ success: true, message: "Board deleted successfully" })
  } catch (error) {
    logger.error("Error deleting board", { error })
    return NextResponse.json(
      { message: "An error occurred while deleting the board" },
      { status: 500 }
    )
  }
}
