import db from "@/prisma/prisma"

export const getAllCommentWithDocAndUser = async () => {
    const comments = await db.comment.findMany({
        include: {
            user: true,
            document: true,
            parent: true,
            replies: true,
            _count: {
                select: {
                    replies: true
                }
            }
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    return comments;
};