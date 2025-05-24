import db from "@/prisma/prisma";

export const getCommunityDocuments = async () => {
    const documents = await db.document.findMany({
        include: { user: true }, // Fetch author details
        orderBy: { createdAt: "desc" }, // Newest first
    });
    return documents;
};

export const getAllDocumentWithUserAndComment = async () => {
    const documents = await db.document.findMany({
        include: {
            user: true,
            Comment: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })
    return documents
}


export const getDocumentById = async (id: string) => {
    try {
        const document = await db.document.findUnique({
            where: { id },
            include: { user: true }
        })
        return document
    } catch (error) {
        console.error("Error fetching document:", error)
        return null
    }
}