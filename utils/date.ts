
export type TDateFormat = "fullDate" | "onlyDate" | "onlyMonthYear" | "onlyDateReverse" | "onlyTime";

export function formatDate(isoString: string | Date, format: TDateFormat = "fullDate") {
    const date = new Date(isoString);

    const pad = (num: number) => num.toString().padStart(2, "0");

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear();

    switch (format) {
        case "fullDate":
            return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
        case "onlyDate":
            return `${day}/${month}/${year}`;
        case "onlyMonthYear":
            return `${month}/${year}`;
        case "onlyDateReverse":
            return `${year}-${month}-${day}`;
        case "onlyTime":
            return `${hours}:${minutes}:${seconds}`;
    }
}

export function getMonthYearName(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export function getLastUpdatedTime(isoString: string): string {
    const lastUpdatedTime = new Date(isoString);
    const currentTime = new Date();

    const diffInSeconds = Math.floor((currentTime.getTime() - lastUpdatedTime.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
        return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
    }
}

export function getDiffTime(startTime: string, endTime: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    return {
        days: diffInDays,
        hours: diffInHours % 24,
        minutes: diffInMinutes % 60,
        seconds: diffInSeconds % 60,
    }
}