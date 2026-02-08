"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
export interface TripListItem {
    id: string;
    title: string;
    completed: boolean;
}


const initialItems: TripListItem[] = [
    { id: "1", title: "Book flight tickets", completed: true },
    { id: "2", title: "Pack passport & documents", completed: false },
    { id: "3", title: "Reserve hotel", completed: false },
];

export default function TripList() {
    const [items, setItems] = useState<TripListItem[]>(initialItems);
    const [input, setInput] = useState("");

    const addItem = () => {
        if (!input.trim()) return;

        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                title: input,
                completed: false,
            },
        ]);
        setInput("");
    };

    const toggleItem = (id: string) => {
        setItems(
            items.map((item) =>
                item.id === id
                    ? { ...item, completed: !item.completed }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trip Checklist</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Add Item */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Add item (e.g. Pack charger)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addItem()}
                    />
                    <Button onClick={addItem}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* List */}
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No items yet. Start adding things to prepare for your trip ✨
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={item.completed}
                                        onCheckedChange={() => toggleItem(item.id)}
                                    />
                                    <span
                                        className={`text-sm ${item.completed
                                                ? "line-through text-muted-foreground"
                                                : ""
                                            }`}
                                    >
                                        {item.title}
                                    </span>
                                </div>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
