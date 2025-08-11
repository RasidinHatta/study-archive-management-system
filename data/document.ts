// Import the Prisma client instance
import db from "@/prisma/prisma";

/**
 * Fetches all community documents with user details
 * @returns documents Array of documents with user information
 */
export const getCommunityDocuments = async () => {
    const documents = await db.document.findMany({
        include: { user: true }, // Include the associated user (author) details
        orderBy: { createdAt: "desc" }, // Sort by creation date (newest first)
    });
    return documents;
};

/**
 * Fetches documents belonging to a specific user
 * @param {string} userId - ID of the user whose documents to fetch
 * @returns documents Array of the user's documents
 */
export const getMyDocuments = async (userId: string) => {
    const documents = await db.document.findMany({
        where: { userId }, // Filter by user ID
        include: { user: true }, // Include user details
        orderBy: { createdAt: "desc" }, // Sort by creation date (newest first)
    });
    return documents;
}

/**
 * Fetches all documents with associated user and comment data
 * @returns documents Array of documents with user and comments
 */
export const getAllDocumentWithUserAndComment = async () => {
    const documents = await db.document.findMany({
        include: {
            user: true,     // Include author details
            Comment: true   // Include all comments
        },
        orderBy: {
            updatedAt: "desc" // Sort by last updated date (newest first)
        }
    })
    return documents
}

/**
 * Fetches a single document by ID with user details
 * @param {string} id - Document ID to fetch
 * @returns documents The requested document or null if not found/error
 */
export const getDocumentById = async (id: string) => {
    try {
        const document = await db.document.findUnique({
            where: { id },  // Find by document ID
            include: { user: true }  // Include author details
        })
        return document
    } catch (error) {
        console.error("Error fetching document:", error)
        return null  // Return null on error
    }
}