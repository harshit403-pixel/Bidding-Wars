import { useCallback, useEffect, useRef, useState } from "react";

import { useSocket } from "./useSocket";
import type {
    AuctionState,
    BidPayload,
    NewHighestBid,
    TimerUpdate,
    ParticipantUpdate,
    UserJoined,
    UserLeft,
    AuctionStarted,
    AuctionEnded,
    SocketError,
    ChatMessage,
} from "./socket.types";
import { toast } from "sonner";

interface UseAuctionSocketReturn {
    auction: AuctionState | null;
    connected: boolean;
    placeBid: (payload: BidPayload) => void;
    chatMessages: ChatMessage[];
    sendChatMessage: (message: string) => void;
}

export function useAuctionSocket(roomId: string | undefined): UseAuctionSocketReturn {
    const { socket, connected } = useSocket();
    const [auction, setAuction] = useState<AuctionState | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const joinedRef = useRef(false);

    useEffect(() => {
        if (!socket || !connected || !roomId) return;

        socket.emit("join_auction", { roomId });
        joinedRef.current = true;

        function onAuctionState(state: AuctionState) {
            setAuction(state);
            if (state.chatMessages && Array.isArray(state.chatMessages)) {
                setChatMessages(state.chatMessages);
            }
        }

        function onNewHighestBid(data: NewHighestBid) {
            setAuction((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    auction: data.auction,
                    currentPrice: data.amount,
                    highestBidder: data.highestBidder,
                };
            });
        }

        function onTimerUpdate(data: TimerUpdate) {
            setAuction((prev) => {
                if (!prev) return prev;
                const newStatus = data.remainingSeconds <= 0 ? "ended" : data.status || prev.status;
                return {
                    ...prev,
                    remainingSeconds: data.remainingSeconds,
                    status: newStatus,
                };
            });
        }

        function onParticipantsUpdated(data: ParticipantUpdate) {
            setAuction((prev) => {
                if (!prev) return prev;
                return { ...prev, participants: data.participants };
            });
        }

        function onUserJoined(data: UserJoined) {
            toast.info(`${data.username} joined the auction`);
        }

        function onUserLeft(data: UserLeft) {
            toast.info(`${data.username} left the auction`);
        }

        function onAuctionStarted(data: AuctionStarted) {
            setAuction((prev) => ({
                auction: data.auction,
                highestBidder: data.auction.highestBidder ?? prev?.highestBidder ?? null,
                currentPrice: data.auction.currentPrice,
                remainingSeconds: prev?.remainingSeconds ?? 0,
                participants: prev?.participants ?? 0,
                status: data.auction.status || "active",
            }));
            toast.info("Auction has started!");
        }

        function onAuctionEnded(data: AuctionEnded) {
            setAuction((prev) => ({
                auction: data.auction,
                highestBidder: data.auction.highestBidder ?? prev?.highestBidder ?? null,
                currentPrice: data.auction.currentPrice,
                remainingSeconds: 0,
                participants: prev?.participants ?? 0,
                status: "ended",
            }));
            toast.info("Auction has ended!");
        }

        function onNewChatMessage(msg: ChatMessage) {
            setChatMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev.slice(-100), msg];
            });
        }

        function onSocketError(err: SocketError) {
            toast.error(err.message);
        }

        socket.on("auction_state", onAuctionState);
        socket.on("new_highest_bid", onNewHighestBid);
        socket.on("timer_update", onTimerUpdate);
        socket.on("participants_updated", onParticipantsUpdated);
        socket.on("user_joined", onUserJoined);
        socket.on("user_left", onUserLeft);
        socket.on("auction_started", onAuctionStarted);
        socket.on("auction_ended", onAuctionEnded);
        socket.on("new_chat_message", onNewChatMessage);
        socket.on("socket_error", onSocketError);

        return () => {
            socket.off("auction_state", onAuctionState);
            socket.off("new_highest_bid", onNewHighestBid);
            socket.off("timer_update", onTimerUpdate);
            socket.off("participants_updated", onParticipantsUpdated);
            socket.off("user_joined", onUserJoined);
            socket.off("user_left", onUserLeft);
            socket.off("auction_started", onAuctionStarted);
            socket.off("auction_ended", onAuctionEnded);
            socket.off("new_chat_message", onNewChatMessage);
            socket.off("socket_error", onSocketError);

            if (joinedRef.current && roomId) {
                socket.emit("leave_auction", { roomId });
                joinedRef.current = false;
            }
            setAuction(null);
            setChatMessages([]);
        };
    }, [socket, connected, roomId]);

    const placeBid = useCallback(
        (payload: BidPayload) => {
            if (!socket?.connected) {
                toast.error("Not connected to server");
                return;
            }
            socket.emit("place_bid", payload);
        },
        [socket],
    );

    const sendChatMessage = useCallback(
        (message: string) => {
            if (!socket?.connected) {
                toast.error("Not connected to auction room");
                return;
            }
            if (!roomId || !message.trim()) return;
            socket.emit("send_chat_message", { roomId, message: message.trim() });
        },
        [socket, roomId],
    );

    return { auction, connected, placeBid, chatMessages, sendChatMessage };
}
