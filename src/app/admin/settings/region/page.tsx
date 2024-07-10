"use client"
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PropsWithChildren } from "react";


export default function Page() {
    return (
        <main className="container">
            <article>
                <header>
                    <h1 className="text-2xl font-bold flex-1">Region</h1>
                    <section className="actions">
                        <SheetTrigger asChild>
                            <Button>
                                <LucideIcon name="Plus" />
                                <span>Create</span>
                            </Button>
                        </SheetTrigger>
                    </section>
                </header>
            </article>
        </main>
    );
}

const CreateEditRegionSheet = ({ children }: PropsWithChildren<{}>) => {
    return <Sheet>
        {children}
    </Sheet>
}