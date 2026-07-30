interface ScheduleSectionProps {
    startsAt: string;
    endsAt: string;
    onStartsAtChange: (value: string) => void;
    onEndsAtChange: (value: string) => void;
}

function toLocalDateTimeString(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ScheduleSection({
    startsAt,
    endsAt,
    onStartsAtChange,
    onEndsAtChange,
}: ScheduleSectionProps) {
    const minDateTime = toLocalDateTimeString(new Date());

    const minEndDateTime = startsAt
        ? toLocalDateTimeString(new Date(new Date(startsAt).getTime() + 60 * 60 * 1000))
        : minDateTime;

    return (
        <section>
            <h3
                className="mb-6 text-3xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Schedule
            </h3>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        value={startsAt}
                        min={minDateTime}
                        onChange={(e) => onStartsAtChange(e.target.value)}
                        className="mt-2 w-full border border-neutral-300 bg-white p-4 outline-none transition focus:border-[#FF3B00]"
                    />
                    <p className="mt-1 text-xs text-neutral-400">
                        Must be in the future
                    </p>
                </div>

                <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                        End Time
                    </label>
                    <input
                        type="datetime-local"
                        value={endsAt}
                        min={minEndDateTime}
                        onChange={(e) => onEndsAtChange(e.target.value)}
                        className="mt-2 w-full border border-neutral-300 bg-white p-4 outline-none transition focus:border-[#FF3B00]"
                    />
                    <p className="mt-1 text-xs text-neutral-400">
                        Auto-set to +1hr from start
                    </p>
                </div>
            </div>
        </section>
    );
}

export default ScheduleSection;