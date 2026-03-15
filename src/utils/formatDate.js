export const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
};

export const getYear = (dateStr) =>
    dateStr ? new Date(dateStr).getFullYear() : "";