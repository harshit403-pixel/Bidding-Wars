import { SendHorizontal } from "lucide-react";

const messages = [
    {
        id: 1,
        name: "Harshit",
        message: "Going all in 🔥",
        time: "2s",
    },
    {
        id: 2,
        name: "Rahul",
        message: "Beautiful watch!",
        time: "10s",
    },
    {
        id: 3,
        name: "Ankit",
        message: "Next bid is mine.",
        time: "18s",
    },
    {
        id: 4,
        name: "Priya",
        message: "This is getting expensive 😄",
        time: "28s",
    },
];

function LiveChat() {
    return (
        <aside className="border border-neutral-300 bg-white">

            <div className="border-b border-neutral-300 p-6">

                <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                    Live Chat
                </p>

                <h2
                    className="mt-2 text-5xl uppercase"
                    style={{ fontFamily: "Bebas Neue" }}
                >
                    Discussion
                </h2>

            </div>

            <div className="h-[450px] space-y-6 overflow-y-auto p-6">

                {messages.map((msg) => (
                    <div key={msg.id}>

                        <div className="flex items-center justify-between">

                            <h4 className="font-semibold">
                                {msg.name}
                            </h4>

                            <span className="text-sm text-neutral-500">
                                {msg.time}
                            </span>

                        </div>

                        <p className="mt-2 text-neutral-600">
                            {msg.message}
                        </p>

                    </div>
                ))}

            </div>

            <div className="border-t border-neutral-300 p-6">

                <div className="flex">

                    <input
                        placeholder="Type a message..."
                        className="flex-1 border border-neutral-300 px-4 py-3 outline-none"
                    />

                    <button className="ml-3 bg-[#111111] px-5 text-white transition hover:bg-[#FF3B00]">
                        <SendHorizontal size={18} />
                    </button>

                </div>

            </div>

        </aside>
    );
}

export default LiveChat;