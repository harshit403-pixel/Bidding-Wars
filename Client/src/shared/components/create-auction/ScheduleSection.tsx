interface ScheduleSectionProps {
    startsAt: string;
    endsAt: string;
    onStartsAtChange: (value: string) => void;
    onEndsAtChange: (value: string) => void;
}

function ScheduleSection({
    startsAt,
    endsAt,
    onStartsAtChange,
    onEndsAtChange,
}: ScheduleSectionProps) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);

    const minEndDateTime = startsAt
        ? new Date(new Date(startsAt).getTime() + 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)
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