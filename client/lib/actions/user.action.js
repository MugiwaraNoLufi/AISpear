"use server";
import { connectToDatabase } from "../../database";
import User from "../../database/user.model";

export const createUser = async (user) => {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log("Error creating user", error);
  }
};

export async function updateUser(user) {
  try {
    await connectToDatabase();
    console.log("Printing from update user", user);
    const { clerkId } = user;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log("Error deleting user", error);
  }
}

export async function deleteUser(clerkId) {
  try {
    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) throw new Error("User deletion failed");
    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    console.log("Error deleting user", error);
  }
}

export async function getUserById(clerkId) {
  try {
    connectToDatabase();
    console.log("Printing from clerkid", clerkId);
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");
    console.log(user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
}
