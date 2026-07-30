function ScheduleSection() {
    return (
        <section>

            <h3 className="mb-6 text-3xl font-semibold">
                Schedule
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

                <input
                    type="datetime-local"
                    className="border border-neutral-300 p-4"
                />

                <input
                    type="datetime-local"
                    className="border border-neutral-300 p-4"
                />

            </div>

        </section>
    );
}

export default ScheduleSection;