"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Tag, TagInput } from 'emblor-maintained';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

import { Checkbox } from "@/components/ui/checkbox";
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

    const handleUpdate = async (values: UpdateAdventureFormValues) => {
        if (!adventureId) return;
        setIsUpdating(true);
        try {
            await updateAdventure.mutateAsync({
                adventureId,
                data: values as AdventureDTO,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-1">
                    <Pencil className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[90%] max-w-lg rounded-lg p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        Edit Adventure
                    </AlertDialogTitle>
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

                        {/* RATING */}
                        <Field data-invalid={touchedFields.rating && !!errors.rating}>
                            <FieldLabel htmlFor="rating">Rating (0-5)</FieldLabel>
                            <Input
                                id="rating"
                                type="number"
                                step={0.1}
                                min={0}
                                max={5}
                                {...register("rating", { valueAsNumber: true })}
                                aria-invalid={!!errors.rating}
                            />
                            {errors.rating && <FieldError errors={[errors.rating]} />}
                        </Field>

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

                        {/* PUBLIC VISIBILITY */}
                        <Field>
                            <Controller
                                control={control}
                                name="publicVisibility"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="publicVisibility"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FieldLabel htmlFor="publicVisibility">
                                            Public Visibility
                                        </FieldLabel>
                                    </div>
                                )}
                            />
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
                            <Button type="button" variant="outline" onClick={() => reset(defaultValues)}>
                                Cancel
                            </Button>
                        </AlertDialogCancel>

                        <AlertDialogAction asChild>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Updating..." : "Update Adventure"}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
