import { createHash, randomUUID } from "node:crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const baseFolder = process.env.CLOUDINARY_FOLDER?.trim().replace(/^\/+|\/+$/g, "");

function getConfig() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary configuration is incomplete");
  }

  return { cloudName, apiKey, apiSecret };
}

function signParams(params: Record<string, string>, secret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${payload}${secret}`)
    .digest("hex");
}

function buildFolder(folder: string) {
  return baseFolder ? `${baseFolder}/${folder}` : folder;
}

function sanitizeBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getResourceType(mimeType: string) {
  return mimeType.startsWith("image/") ? "image" : "raw";
}

type UploadOptions = {
  file: File;
  folder: string;
  publicIdPrefix: string;
};

type UploadResult = {
  url: string;
  publicId: string;
  resourceType: "image" | "raw";
};

export async function uploadToCloudinary({
  file,
  folder,
  publicIdPrefix,
}: UploadOptions): Promise<UploadResult> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const resourceType = getResourceType(file.type);
  const targetFolder = buildFolder(folder);
  const safeName = sanitizeBaseName(file.name) || "file";
  const publicId = `${publicIdPrefix}-${safeName}-${randomUUID()}`;

  const paramsToSign = {
    folder: targetFolder,
    public_id: publicId,
    timestamp,
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", targetFolder);
  formData.append("public_id", publicId);
  formData.append("signature", signParams(paramsToSign, apiSecret));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary upload failed: ${body}`);
  }

  const data = (await response.json()) as {
    public_id: string;
    secure_url: string;
  };

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  mimeType: string | null | undefined,
) {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const resourceType = getResourceType(mimeType || "");

  const paramsToSign = {
    public_id: publicId,
    timestamp,
  };

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signParams(paramsToSign, apiSecret));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary delete failed: ${body}`);
  }
}
