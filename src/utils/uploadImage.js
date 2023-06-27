import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./db";

export async function uploadImage(imageURL) {
    const metaData = {
        contentType: "image/jpeg"
    };

    const imageRef = ref(db, imageURL.name);

    

    try {
        const uploadTask = await uploadBytes(imageRef, imageURL, metaData);
        console.log("Image upload completed");

        const image = await getDownloadURL(uploadTask.ref);
        return image;
        
    } catch (err) {
        console.log("Error uploading image: " + err.message)
    }

    return null;
}