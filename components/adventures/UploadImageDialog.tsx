"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { uploadImagesSchema } from "@/schemas/uploadImages";
import { toast } from "react-toastify";
import { useUploadImages } from "@/hooks/images/useUploadImages";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;
const MAX_FILES = 10;

interface Props {
    adventureId: number;
}

export function UploadImageDialog({ adventureId }: Props) {
    const [files, setFiles] = useState<File[]>([]);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ images: File[] }>({
        resolver: zodResolver(uploadImagesSchema),
        defaultValues: { images: [] },
    });

    const uploadImages = useUploadImages(adventureId);

    async function handleFiles(selected: FileList | null) {
        if (!selected) return;

        const newFiles: File[] = [];
        const rejected: string[] = [];

        for (const file of Array.from(selected)) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                rejected.push(`${file.name} (invalid type)`);
                continue;
            }

            let finalFile = file;

            if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
                try {
                    finalFile = await imageCompression(file, {
                        maxSizeMB: MAX_SIZE_MB,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    });
                } catch {
                    rejected.push(`${file.name} (compression failed)`);
                    continue;
                }
            }

            newFiles.push(finalFile);
        }

        if (rejected.length) {
            toast.error(
                <div>
                    <p className="font-medium">Some files were rejected</p>
                    <p className="text-sm">{rejected.join(", ")}</p>
                </div>
            );
        }

        const combinedFiles = [...files, ...newFiles];
        if (combinedFiles.length > MAX_FILES) {
            toast.error(`You can upload up to ${MAX_FILES} images`);
            return;
        }

        setFiles(combinedFiles);
        setValue("images", combinedFiles);
    }

    function removeFile(index: number) {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        setValue("images", updated);
    }

    async function onSubmit(data: { images: File[] }) {
        if (!data.images.length) {
            toast.error("No images selected");
            return;
        }

        uploadImages.mutate(data.images, {
            onSuccess: () => {
                setFiles([]);
                setValue("images", []);
            },
            onError: () => {
                toast.error("Upload failed");
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload images</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Upload Area */}
                    <Controller
                        control={control}
                        name="images"
                        render={() => (
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-sm text-muted-foreground hover:bg-muted">
                                <Upload className="mb-2 h-6 w-6" />
                                Click to upload images
                                <input
                                    type="file"
                                    accept={ALLOWED_TYPES.join(",")}
                                    multiple
                                    hidden
                                    disabled={uploadImages.isPending}
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                            </label>
                        )}
                    />

                    {/* Errors */}
                    {errors.images && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.images.message}
                        </p>
                    )}

                    {/* Preview */}
                    {files.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-lg border"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="h-24 w-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        disabled={uploadImages.isPending}
                                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            disabled={uploadImages.isPending}
                            onClick={() => {
                                setFiles([]);
                                setValue("images", []);
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            disabled={!files.length || uploadImages.isPending}
                        >
                            {uploadImages.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Upload
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
