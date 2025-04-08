'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import Event from '@/lib/database/models/event.model';
import { handleError } from '@/lib/utils';

export const createUser  = async (user: {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: { email: string }[]; 
  username: string;
}) => {
  try {
    await connectToDatabase();

    const newUser  = await User.findOneAndUpdate(
      { clerkId: user.id }, 
      {
        $set: {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email_addresses[0].email,
          username: user.username,
          imageUrl: user.image_url, 
        },
      },
      { new: true, upsert: true } 
    );

    return JSON.parse(JSON.stringify(newUser ));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to create user'); 
  }
};

export async function getUserById(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) throw new Error('User  not found');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to retrieve user'); 
  }
}

export async function updateUser (clerkId: string, user: {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
}) {
  try {
    await connectToDatabase();

    const updatedUser  = await User.findOneAndUpdate({ clerkId }, user, { new: true });

    if (!updatedUser ) throw new Error('User  update failed');
    return JSON.parse(JSON.stringify(updatedUser ));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to update user');
  }
}

export async function deleteUser (clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error('User  not found');
    }

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
    ]);

    const deletedUser  = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');

    return deletedUser  ? JSON.parse(JSON.stringify(deletedUser )) : null;
  } catch (error) {
    handleError(error);
    throw new Error('Failed to delete user'); 
  }
}