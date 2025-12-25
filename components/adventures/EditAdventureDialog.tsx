"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, TagInput } from 'emblor-maintained';
import { Pencil, Star } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";

import useUpdateAdventure from "@/hooks/adventures/useUpdateAdventure";
import {
    UpdateAdventureFormValues,
    UpdateAdventureSchema,
} from "@/schemas/updateAdventure";
import { AdventureDTO } from "@/types/AdventureDTO";
import { Switch } from "../ui/switch";

interface UpdateAdventureDialogProps {
    adventureId: number;
    defaultValues: AdventureDTO;
}

export default function UpdateAdventureDialog({
    adventureId,
    defaultValues,
}: UpdateAdventureDialogProps) {
    const updateAdventure = useUpdateAdventure();
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors, touchedFields },
    } = useForm<UpdateAdventureFormValues>({
        resolver: zodResolver(UpdateAdventureSchema),
        defaultValues,
    });

    const descriptionValue = watch("description") ?? "";
    const nameValue = watch("name") ?? "";
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const handleUpdate = async (values: UpdateAdventureFormValues) => {
        if (!adventureId) return;

        setIsUpdating(true);
        try {
            await updateAdventure.mutateAsync({
                adventureId,
                data: values as AdventureDTO,
            });

            setOpen(false);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-1">
                    <Pencil className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-lg p-6 md:max-w-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        Edit Adventure
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-sm mt-2">
                        Make changes to your adventure details and keep your journey up to date.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(handleUpdate)}>
                    <FieldGroup>
                        {/* NAME */}
                        <Field data-invalid={touchedFields.name && !!errors.name}>
                            <FieldLabel htmlFor="name">Adventure Name</FieldLabel>
                            <Input
                                id="name"
                                {...register("name")}
                                aria-invalid={!!errors.name}
                                autoComplete="off"
                                placeholder="Enter adventure name"
                            />
                            <FieldDescription>
                                {nameValue.length}/120 characters
                            </FieldDescription>
                            {errors.name && <FieldError errors={[errors.name]} />}
                        </Field>

                        <div className="flex gap-2">
                            {/* RATING */}
                            <Field data-invalid={touchedFields.rating && !!errors.rating}>
                                <FieldLabel>Rating</FieldLabel>

                                <Controller
                                    control={control}
                                    name="rating"
                                    render={({ field }) => (
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => field.onChange(star)}
                                                    className="focus:outline-none"
                                                    aria-label={`Rate ${star} star`}
                                                >
                                                    <Star
                                                        className={`h-6 w-6 transition ${star <= (field.value ?? 0)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-muted-foreground"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                />

                                {errors.rating && <FieldError errors={[errors.rating]} />}
                            </Field>
                            {/* PUBLIC VISIBILITY */}
                            <Field>
                                <Controller
                                    control={control}
                                    name="publicVisibility"
                                    render={({ field }) => (
                                        <div className="flex flex-col items-start justify-between gap-4 px-3">
                                            <FieldLabel htmlFor="publicVisibility">
                                                Public Visibility
                                            </FieldLabel>

                                            <Switch
                                                id="publicVisibility"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />
                            </Field>
                        </div>
                        {/* DESCRIPTION */}
                        <Field data-invalid={touchedFields.description && !!errors.description}>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    id="description"
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    {...register("description")}
                                    aria-invalid={!!errors.description}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {descriptionValue.length}/2000
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>Adventure details, up to 2000 chars.</FieldDescription>
                            {errors.description && <FieldError errors={[errors.description]} />}
                        </Field>

                        {/* LATITUDE */}
                        <Field data-invalid={touchedFields.latitude && !!errors.latitude}>
                            <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                            <Input
                                id="latitude"
                                type="number"
                                step={0.000001}
                                {...register("latitude", { valueAsNumber: true })}
                                aria-invalid={!!errors.latitude}
                            />
                            {errors.latitude && <FieldError errors={[errors.latitude]} />}
                        </Field>

                        {/* LONGITUDE */}
                        <Field data-invalid={touchedFields.longitude && !!errors.longitude}>
                            <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                            <Input
                                id="longitude"
                                type="number"
                                step={0.000001}
                                {...register("longitude", { valueAsNumber: true })}
                                aria-invalid={!!errors.longitude}
                            />
                            {errors.longitude && <FieldError errors={[errors.longitude]} />}
                        </Field>



                        {/* TAGS */}
                        <Field data-invalid={touchedFields.tags && !!errors.tags}>
                            <FieldLabel>Tags (max 5)</FieldLabel>

                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => {
                                    const tagsAsObjects: Tag[] =
                                        (field.value ?? []).map((t) => ({ id: t, text: t }));

                                    return (
                                        <TagInput
                                            tags={tagsAsObjects}
                                            activeTagIndex={activeTagIndex}
                                            setActiveTagIndex={setActiveTagIndex}
                                            placeholder="Add a tag"
                                            className="w-full"
                                            setTags={(newTags) => {
                                                // 🔑 Normalize SetStateAction<Tag[]>
                                                const resolvedTags =
                                                    typeof newTags === "function"
                                                        ? newTags(tagsAsObjects)
                                                        : newTags;

                                                const tagStrings = resolvedTags
                                                    .map((t) => t.text.trim())
                                                    .filter(Boolean)
                                                    .slice(0, 5);

                                                field.onChange(tagStrings);
                                            }}
                                        />
                                    );
                                }}
                            />


                            {errors.tags && (
                                <FieldError
                                    errors={
                                        Array.isArray(errors.tags)
                                            ? errors.tags.map((e) => ({ message: e?.message }))
                                            : [{ message: errors.tags.message }]
                                    }
                                />
                            )}

                            <FieldDescription>Press enter to add a tag (max 5)</FieldDescription>
                        </Field>

                    </FieldGroup>

                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset(defaultValues);
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>

                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update Adventure"}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
