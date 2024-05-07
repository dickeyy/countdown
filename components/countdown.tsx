"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from "./ui/input";

export default function Countdown() {
    const [inputDate, setInputDate] = useState<Date>();
    const [inputTime, setInputTime] = useState<string>();
    const [timezone, setTimezone] = useState<string>("-06:00"); // ["-07:00", "-08:00", "-09:00" etc]
    const [label, setLabel] = useState<string>("event"); // ["PST", "MST", "CST" etc
    const [timeOfEvent, setTimeOfEvent] = useState<any>(new Date());
    const [timerActive, setTimerActive] = useState<boolean>(false); // [true, false]
    const [timeTill, setTimeTill] = useState(["00", "00", "00", "00", "00"]);

    // automatically get the users timezone
    useEffect(() => {
        const tzMatcher = new Date().toString().match(/([-\+][0-9]+)\s/);
        if (tzMatcher) {
            setTimezone(tzMatcher[1]);
        } else {
            console.error("Could not determine timezone.");
        }
    }, []);

    useEffect(() => {
        if (timerActive) {
            const interval = setInterval(() => {
                // calculate the exact time until the event {days, hours, minutes, seconds} add leading zeros
                const timeLeft: any = Number(timeOfEvent) - Number(new Date());
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                // get the 2 digit milliseconds
                const milliseconds = Math.floor((timeLeft % 1000) / 10);

                // if any of the values are less than 0, clear the interval and set the time to 00:00:00:00
                if (timeLeft < 0) {
                    clearInterval(interval);
                    setTimeTill(["00", "00", "00", "00", "00"]);
                    setTimerActive(false);
                    return;
                }

                setTimeTill([
                    days.toString().padStart(2, "0"),
                    hours.toString().padStart(2, "0"),
                    minutes.toString().padStart(2, "0"),
                    seconds.toString().padStart(2, "0"),
                    milliseconds.toString().padStart(2, "0")
                ]);
            }, 10);
            return () => clearInterval(interval);
        }
    });

    return (
        <div className="flex flex-col items-center justify-between text-center">
            <div className="flex flex-col items-center justify-center">
                <p className="mb-4 text-lg text-foreground/40">Time until {label}:</p>
                <p
                    className={`font-mono text-3xl font-normal sm:text-6xl
                    ${timerActive && timeTill[1] === "00" && timeTill[0] === "00" ? "animate-pulse text-red-500" : "text-foreground"}
                `}
                >
                    {timeTill[0]}:{timeTill[1]}:{timeTill[2]}:{timeTill[3]}
                    <span className="text-[2rem] text-foreground/60">:{timeTill[4]}</span>
                </p>

                <p className="mt-4 text-lg text-foreground/80">
                    {timerActive ? "" : "Countdown is paused, click edit to start."}
                </p>
            </div>
            <div className="absolute bottom-4">
                <Dialog>
                    <DialogTrigger>
                        <Button
                            variant={"ghost"}
                            className="px-12 font-normal text-muted-foreground hover:font-medium"
                        >
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit countdown date.</DialogTitle>
                            <DialogDescription>
                                Enter the date and time for the event you are counting down to.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "justify-start text-left font-normal",
                                                !inputDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {inputDate ? (
                                                format(inputDate, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={inputDate}
                                            onSelect={setInputDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Input
                                    type="time"
                                    value={inputTime}
                                    onChange={(e) => setInputTime(e.target.value)}
                                    // hide the clock icon
                                    className="relative appearance-none"
                                />

                                <Input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="Event label"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant={"default"}
                                    onClick={() => {
                                        console.log(timezone);
                                        setTimeOfEvent(
                                            new Date(
                                                `${inputDate?.toISOString().split("T")[0]}T${inputTime}:00${timezone ?? "-0600"}`
                                            )
                                        );
                                        setTimerActive(true);
                                    }}
                                >
                                    Save
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
