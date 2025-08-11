import db from "@/prisma/prisma"

/**
 * Fetches all comments with their associated documents, users, and reply information
 * @returns comments Array of comments with nested relations and counts
 * 
 * This function retrieves all comments from the database with the following related data:
 * - The user who made each comment
 * - The document each comment belongs to
 * - The parent comment (if this is a reply)
 * - All replies to each comment
 * - Count of replies for each comment
 * 
 * Comments are ordered by most recently updated first
 */
export const getAllCommentWithDocAndUser = async () => {
    const comments = await db.comment.findMany({
        include: {
            // Include the user who made the comment
            user: true,
            
            // Include the document this comment belongs to
            document: true,
            
            // Include the parent comment if this is a reply
            parent: true,
            
            // Include all replies to this comment
            replies: true,
            
            // Include count of replies for each comment
            _count: {
                select: {
                    replies: true
                }
            }
        },
        // Sort by most recently updated comments first
        orderBy: {
            updatedAt: "desc"
        }
    });
    
    return comments;
};