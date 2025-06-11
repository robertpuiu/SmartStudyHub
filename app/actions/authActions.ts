"use server";

import { prisma } from "@/lib/db";
import { executeAction } from "@/lib/executeAction";

const signupAction = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();
      const role = formData.get("role")?.toString();

      if (!email || !password || !role) {
        throw new Error("Email, password, and role are required");
      }
      await prisma.user.create({
        data: {
          email,
          password, // Ensure you hash the password in a real application
          role,
        },
      });
    },
  });
};
export { signupAction };
