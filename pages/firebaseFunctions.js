import { doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';

export const updateUserInFirebase = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, 'item', userId), updatedData);
    console.log('Document successfully updated in Firebase!');
  } catch (error) {
    console.error('Error updating document in Firebase: ', error);
    throw new Error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลใน Firebase');
  }
};
