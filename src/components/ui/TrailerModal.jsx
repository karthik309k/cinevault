import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TrailerModal({ videoKey, onClose }) {
    useEffect(() => {
        const handler = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl"
                >
                    <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                        title="Trailer"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </motion.div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors"
                >
                    ✕
                </button>
            </motion.div>
        </AnimatePresence>
    );
}