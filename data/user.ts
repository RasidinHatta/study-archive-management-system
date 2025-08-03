import db from "@/prisma/prisma"

export const getAllUser = async () => {
    try {
        const user = await db.user.findMany()
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllUserWithRole = async () => {
    try {
        const users = await db.user.findMany({
            orderBy: {
                name: "asc", // 👈 default sort
            },
        });
        return users;
    } catch (error) {
        console.log(error);
        return null;
    }
};
export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            include: {
                role: true, // ✅ This is required to get `role.name`
            }
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await db.user.findUnique({
            where: {
                email: lowerCaseEmail
            }
        })

        return user;
    } catch (error) {
        return null
    }
}