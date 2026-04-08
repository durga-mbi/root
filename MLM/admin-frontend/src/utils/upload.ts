export const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "frontendfileupload");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhuddbzui/image/upload",
        {
            method: "POST",
            body: data,
        }
    );

    if (!res.ok) {
        throw new Error("Image upload failed");
    }

    const result = await res.json();

    return result.secure_url;
};