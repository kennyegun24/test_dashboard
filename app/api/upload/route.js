// import { NextResponse } from "next/server";
// import path from "path";
// import fs, { readdir, unlink } from "fs";
// import { writeFile } from "fs/promises";
// import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

// export async function POST(req) {
//   try {
//     // Read the raw request body (binary stream)
//     const data = await req.arrayBuffer();
//     const fileBuffer = Buffer.from(data);

//     // Define upload path
//     const uploadDir = path.join(process.cwd(), "public", "uploads");

//     // Ensure directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Generate a unique filename
//     const uniqueFilename = `${Date.now()}.png`; // Change extension as needed
//     const filePath = path.join(uploadDir, uniqueFilename);

//     // Write file to disk
//     await writeFile(filePath, fileBuffer);

//     // Return file URL
//     return NextResponse.json({ url: `/uploads/${uniqueFilename}` });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   const form = formidable({ multiples: false });
//   let fields;
//   let files;

//   try {
//     [fields, files] = await form.parse(req);
//     const imageFile = files.file[0];

//     if ((!imageFile, !imageFile.filepath)) {
//       return NextResponse.json({ error: "Invalid file" });
//     }

//     const uploadDir = path.join(process.cwd(), "public", "uploads");

//     await fs.mkdir(uploadDir, { recursive: true });

//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() + 1e9);
//     const newFileName = `${uniqueSuffix}-${imageFile.originalFilename}`;
//     const newFilePath = `${uploadDir}/${newFileName}`;

//     await fs.rename(imageFile.filepath, newFilePath);

//     return NextResponse.json({ imageUrl: `/uploads/${newFileName}` });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");
//     console.log(file, "file");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // Convert file to Buffer properly
//     const fileBuffer = Buffer.from(await file.arrayBuffer());

//     // Get original file extension
//     const ext = path.extname(file.name);
//     const uniqueFilename = `${Date.now()}${ext}`;

//     // Define upload path
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     const filePath = path.join(uploadDir, uniqueFilename);

//     // Ensure directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // **Delete previous logo images**
//     const files = await readdir(uploadDir);
//     for (const file of files) {
//       if (file.startsWith("logo_")) {
//         await unlink(path.join(uploadDir, file));
//         console.log(`Deleted old logo: ${file}`);
//       }
//     }

//     // **Write file properly**
//     await writeFile(filePath, fileBuffer, "binary");

//     console.log("File saved successfully:", filePath);

//     return NextResponse.json({
//       url: `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/uploads/${uniqueFilename}`,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile, readdir, unlink } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer properly
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Get original file extension
    const ext = path.extname(file.name);
    const uniqueFilename = `logo_${Date.now()}${ext}`; // Prefixing to identify logos

    // Define upload path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, uniqueFilename);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // **Delete previous logo images**
    const files = await readdir(uploadDir);
    for (const file of files) {
      if (file.startsWith("logo_")) {
        await unlink(path.join(uploadDir, file));
        console.log(`Deleted old logo: ${file}`);
      }
    }

    // **Write new logo file properly**
    await writeFile(filePath, fileBuffer, "binary");

    console.log("New logo saved successfully:", filePath);

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/uploads/${uniqueFilename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
